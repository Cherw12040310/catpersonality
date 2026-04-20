import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Catboard.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const API_BASE_URL = `${BACKEND_URL}/api`;

const Catboard = () => {
    const [cats, setCats] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedImageData, setSelectedImageData] = useState(null)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [catName, setCatName] = useState('')
    const [note, setNote] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [stickerSize, setStickerSize] = useState(100)
    const boardRef = useRef(null)
    const fileInputRef = useRef(null)
    const catSizesRef = useRef({})
    const navigate = useNavigate()

    // Load cats from backend on mount
    useEffect(() => {
        loadCats()
    }, [])

    const loadCats = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_BASE_URL}/cats`)
            if (!response.ok) {
                throw new Error('Failed to fetch cats')
            }
            const catsData = await response.json()

            // Transform backend data to display format
            const displayCats = catsData.map(cat => {
                const imageUrl = `${BACKEND_URL}${cat.imageUrl}`

                return {
                    ...cat,
                    img: imageUrl,
                    size: catSizesRef.current[cat._id] || Math.floor(Math.random() * 40 + 80),
                    x: Math.random() * 0.7 + 0.1, // Use relative positioning instead of board dimensions
                    y: Math.random() * 0.6 + 0.1,
                    rot: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 12 + 4),
                    ts: new Date(cat.timestamp).getTime()
                }
            })

            setCats(displayCats)
        } catch (e) {
            console.error('Could not load cats:', e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (catId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cats/${catId}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Failed to delete')
            setCats(prev => prev.filter(c => c._id !== catId))
        } catch (e) {
            console.error('Delete error:', e)
        }
    }

    const handleAddClick = () => {
        setSelectedImageData(null)
        setSelectedImageFile(null)
        setCatName('')
        setNote('')
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setSelectedImageData(null)
        setSelectedImageFile(null)
        setCatName('')
        setNote('')
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setSelectedImageFile(file)

        const reader = new FileReader()
        reader.onload = (ev) => {
            setSelectedImageData(ev.target.result)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async () => {
        if (!selectedImageFile) {
            alert('add your cute cat here and join the purr friends!')
            return
        }

        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('image', selectedImageFile)
            formData.append('name', catName.trim())
            formData.append('note', note.trim())

            const response = await fetch(`${API_BASE_URL}/cats`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Error response:', errorData)
                throw new Error(errorData.error || 'Failed to save cat')
            }

            const newCat = await response.json()

            if (newCat._id) {
                catSizesRef.current[newCat._id] = stickerSize
            }

            setIsModalVisible(false)
            setSelectedImageData(null)
            setSelectedImageFile(null)
            setCatName('')
            setNote('')
            setPersonality('')
            setStickerSize(100)

            // Wait a bit for modal to close and image to be written to disk, then reload cats
            setTimeout(async () => {
                await loadCats()
            }, 800)
        } catch (e) {
            console.error('Upload error:', e)
            console.error('Error message:', e.message)
            alert(`could not save - ${e.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <>
            <img src="/images/ui/1.svg" className="bg-image" alt="" />

            <div className="page">
                <div className="title-section">
                    <p className="board-title">Add your cute cat to the purr family</p>
                    <p className="board-subtitle">No cat yet? Scroll through our cute gallery and enjoy the view until you get one. </p>
                </div>

                <div className="board-container">
                    <div className="board-wrap">
                        {isLoading && (
                            <p className="loading-text">loading purr board...</p>
                        )}
                        {!isLoading && cats.length === 0 && (
                            <div className="empty-state">
                                <p>Add your cute cat photo and join the purr friends</p>
                            </div>
                        )}
                        <div className="board" ref={boardRef}>
                            {cats.map((cat, index) => (
                                <CatSticker key={cat.ts || index} cat={cat} boardRef={boardRef} onDelete={handleDelete} />
                            ))}
                        </div>
                    </div>
                    <button className="add-btn" onClick={handleAddClick} aria-label="Add cat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>

                <button className="btn-primary continue-btn" onClick={() => navigate('/final')}>
                    Continue
                </button>
            </div>

            {isModalVisible && (
                <div className="modal-overlay visible">
                    <div className="modal">
                        <p className="modal-title">add your cat here </p>
                        <div className="upload-area" onClick={() => fileInputRef.current.click()}>
                            {selectedImageData ? (
                                <img className="upload-preview" src={selectedImageData} alt="Preview" style={{ display: 'block' }} />
                            ) : (
                                <div className="upload-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="3" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path d="M21 15l-5-5L5 21" />
                                    </svg>
                                    <span>tap to upload photo</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <input
                            className="note-input"
                            type="text"
                            placeholder="add a note about your cat..."
                            maxLength="40"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className="size-slider-wrap">
                            <span className="size-slider-label">sticker size: {stickerSize}px</span>
                            <input
                                className="size-slider"
                                type="range"
                                min="60"
                                max="200"
                                value={stickerSize}
                                onChange={(e) => setStickerSize(Number(e.target.value))}
                            />
                        </div>
                        <div className="modal-btn-row">
                            <button className="modal-cancel" onClick={handleCancel}>cancel</button>
                            <button
                                className="modal-submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'posting...' : 'post to board'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const CatSticker = ({ cat, boardRef, onDelete }) => {
    const stickerRef = useRef(null)
    const [imageError, setImageError] = useState(false)
    const [retryCount, setRetryCount] = useState(0)
    const maxRetries = 3

    // Retry loading image if it fails
    const handleImageError = () => {
        if (retryCount < maxRetries) {
            setRetryCount(retryCount + 1)
            // Wait before retrying
            setTimeout(() => {
                if (stickerRef.current?.querySelector('img')) {
                    stickerRef.current.querySelector('img').src = cat.img + '?t=' + Date.now()
                }
            }, 1500)
        } else {
            setImageError(true)
        }
    }

    useEffect(() => {
        if (!stickerRef.current || !boardRef.current) return

        const w = boardRef.current.offsetWidth || 300
        const h = boardRef.current.offsetHeight || 800

        const size = cat.size || Math.floor(Math.random() * 40 + 80)
        const x = cat.x !== undefined ? cat.x * w : Math.random() * (w - size - 20) + 10
        const y = cat.y !== undefined ? cat.y * h : Math.random() * (h - size - 60) + 10
        const rot = cat.rot !== undefined ? cat.rot : (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 12 + 4)

        const element = stickerRef.current
        element.style.width = size + 'px'
        element.style.left = x + 'px'
        element.style.top = y + 'px'
        element.style.transform = `rotate(${rot}deg)`

        // Make draggable
        let isDragging = false
        let startX, startY, origX, origY

        const dragStart = (e) => {
            isDragging = true
            const touch = e.touches ? e.touches[0] : e
            startX = touch.clientX
            startY = touch.clientY
            origX = parseFloat(element.style.left) || 0
            origY = parseFloat(element.style.top) || 0
            element.style.zIndex = '5'
            e.preventDefault()
        }

        const dragMove = (e) => {
            if (!isDragging) return
            const touch = e.touches ? e.touches[0] : e
            const dx = touch.clientX - startX
            const dy = touch.clientY - startY
            element.style.left = (origX + dx) + 'px'
            element.style.top = (origY + dy) + 'px'
        }

        const dragEnd = () => {
            isDragging = false
            element.style.zIndex = ''
        }

        element.addEventListener('mousedown', dragStart)
        window.addEventListener('mousemove', dragMove)
        window.addEventListener('mouseup', dragEnd)
        element.addEventListener('touchstart', dragStart, { passive: false })
        element.addEventListener('touchmove', dragMove, { passive: false })
        element.addEventListener('touchend', dragEnd)

        return () => {
            element.removeEventListener('mousedown', dragStart)
            window.removeEventListener('mousemove', dragMove)
            window.removeEventListener('mouseup', dragEnd)
            element.removeEventListener('touchstart', dragStart)
            element.removeEventListener('touchmove', dragMove)
            element.removeEventListener('touchend', dragEnd)
        }
    }, [cat, boardRef])

    return (
        <div className="cat-sticker" ref={stickerRef}>
            <button
                className="sticker-delete-btn"
                onClick={(e) => { e.stopPropagation(); onDelete(cat._id) }}
            >×</button>
            {!imageError ? (
                <img src={cat.img} alt="Cat" onError={handleImageError} />
            ) : (
                <div style={{
                    width: '100%', height: '100%', background: '#f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', borderRadius: '8px', border: '2px solid #111'
                }}>??</div>
            )}
            <div className="cat-info">
                {cat.note && <p className="cat-note">{cat.note}</p>}
            </div>
        </div>
    )
}

export default Catboard
