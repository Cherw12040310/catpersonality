const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for development and production
const corsOptions = {
    origin: function (origin, callback) {
        console.log(`CORS check - Origin: ${origin}, NODE_ENV: ${process.env.NODE_ENV}`);

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            console.log('CORS: Allowing request with no origin');
            return callback(null, true);
        }

        // Allowed origins for development
        const allowedDevOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5174'
        ];

        // Production domain from environment variable
        const productionOrigin = process.env.PRODUCTION_ORIGIN;

        // Default to development if NODE_ENV is not set
        const nodeEnv = process.env.NODE_ENV || 'development';
        console.log(`Using NODE_ENV: ${nodeEnv}`);

        if (nodeEnv === 'development') {
            // In development, allow localhost origins
            if (allowedDevOrigins.includes(origin)) {
                console.log(`CORS: Allowing ${origin} (development)`);
                return callback(null, true);
            } else {
                console.log(`CORS: Rejecting ${origin} - not in allowed dev origins`);
                console.log('Allowed origins:', allowedDevOrigins);
            }
        } else {
            // In production, allow specific production origin
            if (productionOrigin && origin === productionOrigin) {
                console.log(`CORS: Allowing ${origin} (production)`);
                return callback(null, true);
            } else {
                console.log(`CORS: Rejecting ${origin} - not production origin`);
                console.log(`Production origin: ${productionOrigin}`);
            }
        }

        console.log(`CORS: Rejecting ${origin} with error`);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
    next();
});
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create cats database file if it doesn't exist
const catsDbPath = path.join(__dirname, 'cats.json');
if (!fs.existsSync(catsDbPath)) {
    fs.writeFileSync(catsDbPath, JSON.stringify([]));
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'cat-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Routes

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is working!',
        timestamp: new Date().toISOString(),
        uploadsDir: uploadsDir
    });
});

// List uploaded files
app.get('/api/uploads', (req, res) => {
    console.log("received request for uploads")
    try {
        const files = fs.readdirSync(uploadsDir);
        res.json({
            files: files,
            count: files.length,
            uploadsDir: uploadsDir
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not read uploads directory' });
    }
});

// GET all cats
app.get('/api/cats', (req, res) => {
    try {
        const catsData = fs.readFileSync(catsDbPath, 'utf8');
        const cats = JSON.parse(catsData);

        // Sort by timestamp (newest first)
        cats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(cats);
    } catch (error) {
        console.error('Error reading cats database:', error);
        res.status(500).json({ error: 'Failed to fetch cats' });
    }
});

// POST a new cat
app.post('/api/cats', upload.single('image'), (req, res) => {
    console.log('POST /api/cats - Received request');
    console.log('Request body:', { name: req.body.name, note: req.body.note, personality: req.body.personality });
    console.log('Uploaded file:', req.file ? { filename: req.file.filename, size: req.file.size } : 'none');

    try {
        const { note } = req.body;

        if (!req.file) {
            console.log('Validation failed - missing image');
            return res.status(400).json({ error: 'Image is required' });
        }

        // Read existing cats
        const catsData = fs.readFileSync(catsDbPath, 'utf8');
        const cats = JSON.parse(catsData);

        // Create new cat entry
        const newCat = {
            _id: uuidv4(),
            note: note ? note.trim() : '',
            imageUrl: `/uploads/${req.file.filename}`,
            timestamp: new Date().toISOString()
        };

        // Add to cats array
        cats.push(newCat);

        // Save back to file
        fs.writeFileSync(catsDbPath, JSON.stringify(cats, null, 2));

        res.status(201).json(newCat);
    } catch (error) {
        console.error('Error saving cat:', error);
        res.status(500).json({ error: 'Failed to save cat' });
    }
});

// DELETE a cat (optional, for moderation)
app.delete('/api/cats/:id', (req, res) => {
    try {
        const { id } = req.params;

        // Read existing cats
        const catsData = fs.readFileSync(catsDbPath, 'utf8');
        const cats = JSON.parse(catsData);

        // Find and remove cat
        const catIndex = cats.findIndex(cat => cat._id === id || cat.id === id);
        if (catIndex === -1) {
            return res.status(404).json({ error: 'Cat not found' });
        }

        const deletedCat = cats[catIndex];

        // Delete image file
        const imagePath = path.join(__dirname, deletedCat.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Remove from array
        cats.splice(catIndex, 1);

        // Save back to file
        fs.writeFileSync(catsDbPath, JSON.stringify(cats, null, 2));

        res.json({ message: 'Cat deleted successfully' });
    } catch (error) {
        console.error('Error deleting cat:', error);
        res.status(500).json({ error: 'Failed to delete cat' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Max 5MB.' });
        }
    }
    res.status(500).json({ error: error.message || 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Cat personality backend running on port ${PORT}`);
    console.log(`Uploads directory: ${uploadsDir}`);
    console.log(`Database file: ${catsDbPath}`);
});
