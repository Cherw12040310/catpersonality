# Cat Personality Backend

A simple Node.js/Express backend for the cat personality app that handles cat image uploads and serves them to all users.

## Features

- **Image Upload**: Accepts cat photos with metadata (name, personality, notes)
- **JSON Database**: Stores cat data in a simple JSON file (no external database needed)
- **File Storage**: Saves uploaded images to local filesystem
- **CORS Enabled**: Works with frontend on different port
- **Error Handling**: Proper validation and error responses

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Start the Backend
```bash
# For development (with auto-restart)
npm run dev

# For production
npm start
```

The backend will start on `http://localhost:3001`

### 3. Start the Frontend
In another terminal:
```bash
cd ..
npm run dev
```

The frontend will start on `http://localhost:5173` (or similar)

## API Endpoints

### GET /api/cats
Returns all cats uploaded by users, sorted by newest first.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "Whiskers",
    "note": "Loves to nap in sunbeams",
    "personality": "sleepy",
    "imageUrl": "/uploads/cat-1234567890.jpg",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
]
```

### POST /api/cats
Uploads a new cat with image and metadata.

**Request:** `multipart/form-data`
- `image`: Image file (jpg, png, gif, webp, max 5MB)
- `name`: Cat name (required, max 30 chars)
- `note`: Optional note about cat (max 40 chars)
- `personality`: Cat personality (max 30 chars)

**Response:**
```json
{
  "id": "uuid-string",
  "name": "Whiskers",
  "note": "Loves to nap in sunbeams",
  "personality": "sleepy",
  "imageUrl": "/uploads/cat-1234567890.jpg",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### DELETE /api/cats/:id
Deletes a cat and its image file (for moderation).

## File Structure

```
server/
  package.json          # Dependencies and scripts
  server.js             # Main server file
  cats.json             # Database file (created automatically)
  uploads/              # Uploaded images (created automatically)
    cat-1234567890.jpg  # Example uploaded image
```

## Database

The app uses a simple JSON file (`cats.json`) as the database:

```json
[
  {
    "id": "uuid-string",
    "name": "Whiskers",
    "note": "Loves to nap in sunbeams",
    "personality": "sleepy",
    "imageUrl": "/uploads/cat-1234567890.jpg",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
]
```

**Advantages:**
- No external database required
- Easy to backup and migrate
- Human-readable format
- Fast for small to medium datasets

**Limitations:**
- Not suitable for high-traffic production
- No built-in scaling or replication
- Manual backup required

## Security Notes

- **File Upload Limits**: 5MB max file size, image files only
- **Input Validation**: All text inputs are trimmed and have length limits
- **CORS**: Enabled for development (adjust for production)
- **No Authentication**: This is a demo - add authentication for production

## Development Tips

1. **Clear Database**: Delete `cats.json` to start fresh
2. **Clear Uploads**: Delete files in `uploads/` folder to remove images
3. **Testing**: Use Postman or curl to test API endpoints
4. **Logs**: Server logs show upload activity and errors

## Example curl Commands

```bash
# Get all cats
curl http://localhost:3001/api/cats

# Upload a cat
curl -X POST http://localhost:3001/api/cats \
  -F "image=@/path/to/cat.jpg" \
  -F "name=Whiskers" \
  -F "personality=playful" \
  -F "note=Loves laser pointers"
```

## Production Considerations

For production use, consider:
- Adding user authentication
- Using a proper database (MongoDB, PostgreSQL)
- Implementing rate limiting
- Adding image compression
- Setting up proper file storage (AWS S3, etc.)
- Adding HTTPS and security headers
- Implementing backup strategies
