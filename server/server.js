const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Cloudinary config
const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedDevOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5174'
        ];

        const productionOrigin = process.env.PRODUCTION_ORIGIN;
        const nodeEnv = process.env.NODE_ENV || 'development';

        if (nodeEnv === 'development') {
            if (allowedDevOrigins.includes(origin)) return callback(null, true);
        } else {
            if (productionOrigin && origin === productionOrigin) return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const productionOrigin = process.env.PRODUCTION_ORIGIN;
            const nodeEnv = process.env.NODE_ENV || 'development';
            const allowedDevOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'http://127.0.0.1:5173'];
            if (nodeEnv === 'development') {
                if (allowedDevOrigins.includes(origin)) return callback(null, true);
            } else {
                if (productionOrigin && origin === productionOrigin) return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Cats database
const catsDbPath = path.join(__dirname, 'cats.json');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(catsDbPath)) {
    fs.writeFileSync(catsDbPath, JSON.stringify([]));
}
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Upload storage: use Cloudinary when configured, otherwise local filesystem fallback
const storage = isCloudinaryConfigured
    ? new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'catpersonality',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [{ quality: 'auto' }]
        }
    })
    : multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadsDir),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname) || '.jpg';
            const safeName = `${Date.now()}-${uuidv4()}${ext}`;
            cb(null, safeName);
        }
    });

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

app.get('/api/cats', (req, res) => {
    try {
        const catsData = fs.readFileSync(catsDbPath, 'utf8');
        const cats = JSON.parse(catsData);
        cats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(cats);
    } catch (error) {
        console.error('Error reading cats database:', error);
        res.status(500).json({ error: 'Failed to fetch cats' });
    }
});

app.post('/api/cats', upload.single('image'), (req, res) => {
    try {
        const { note } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const catsData = fs.readFileSync(catsDbPath, 'utf8');
        const cats = JSON.parse(catsData);

        const imageUrl = isCloudinaryConfigured
            ? req.file.path
            : `/uploads/${path.basename(req.file.path)}`;

        const newCat = {
            _id: uuidv4(),
            note: note ? note.trim() : '',
            imageUrl,
            publicId: isCloudinaryConfigured ? req.file.filename : null,
            timestamp: new Date().toISOString()
        };

        cats.push(newCat);
        fs.writeFileSync(catsDbPath, JSON.stringify(cats, null, 2));

        io.emit('catAdded', newCat);
        res.status(201).json(newCat);
    } catch (error) {
        console.error('Error saving cat:', error);
        res.status(500).json({ error: 'Failed to save cat' });
    }
});

app.delete('/api/cats/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const catsData = fs.readFileSync(catsDbPath, 'utf8');
        const cats = JSON.parse(catsData);

        const catIndex = cats.findIndex(cat => cat._id === id || cat.id === id);
        if (catIndex === -1) {
            return res.status(404).json({ error: 'Cat not found' });
        }

        const deletedCat = cats[catIndex];

        if (deletedCat.imageUrl && deletedCat.imageUrl.startsWith('/uploads/')) {
            const localFilePath = path.join(__dirname, deletedCat.imageUrl);
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        }

        // Delete from Cloudinary
        if (deletedCat.publicId) {
            await cloudinary.uploader.destroy(deletedCat.publicId);
        }

        cats.splice(catIndex, 1);
        fs.writeFileSync(catsDbPath, JSON.stringify(cats, null, 2));

        io.emit('catDeleted', id);
        res.json({ message: 'Cat deleted successfully' });
    } catch (error) {
        console.error('Error deleting cat:', error);
        res.status(500).json({ error: 'Failed to delete cat' });
    }
});

app.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Max 5MB.' });
    }
    res.status(500).json({ error: error.message || 'Server error' });
});

server.listen(PORT, () => {
    console.log(`Cat personality backend running on port ${PORT}`);
});
