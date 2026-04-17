import React, { useState, useEffect, useRef } from 'react'
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
    const [personality, setPersonality] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const boardRef = useRef(null)
    const fileInputRef = useRef(null)
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

                // Test if image URL is accessible
                fetch(imageUrl, { method: 'HEAD' })
                    .then(response => {
                        if (!response.ok) {
                            console.error('Image not accessible:', imageUrl, response.status)
                        } else {
                        }
                    })
                    .catch(error => {
                        console.error('Error checking image:', imageUrl, error)
                    })

                return {
                    ...cat,
                    img: imageUrl,
                    size: Math.floor(Math.random() * 40 + 80),
                    x: Math.random() * 0.7 + 0.1, // Use relative positioning instead of board dimensions
                    y: Math.random() * 0.6 + 0.1,
                    rot: Math.random() * 20 - 10,
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

    const handleAddClick = () => {
        setSelectedImageData(null)
        setSelectedImageFile(null)
        setCatName('')
        setNote('')
        setPersonality('')
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setSelectedImageData(null)
        setSelectedImageFile(null)
        setCatName('')
        setNote('')
        setPersonality('')
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
        if (!selectedImageFile || !catName.trim()) {
            alert('please add a photo and name for your cat!')
            return
        }

        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('image', selectedImageFile)
            formData.append('name', catName.trim())
            formData.append('note', note.trim())
            formData.append('personality', personality.trim())

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
            console.log('Success response:', newCat)

            // Close modal first
            setIsModalVisible(false)
            setSelectedImageData(null)
            setSelectedImageFile(null)
            setCatName('')
            setNote('')
            setPersonality('')

            // Wait a bit for modal to close, then reload cats
            setTimeout(async () => {
                await loadCats()
            }, 300)
        } catch (e) {
            console.error('Upload error:', e)
            console.error('Error message:', e.message)
            alert(`could not save - ${e.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }


    const makeDraggable = (element) => {
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
    }

    useEffect(() => {
        // Add drag functionality to cat stickers
        const cleanupFunctions = []
        const catElements = document.querySelectorAll('.cat-sticker')

        catElements.forEach(element => {
            const cleanup = makeDraggable(element)
            cleanupFunctions.push(cleanup)
        })

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup())
        }
    }, [cats])

    return (
        <>
            <img src="/images/ui/1.svg" className="bg-image" alt="" />

            <div className="page">
                <div className="title-section">
                    <p className="board-title">Do you have a cat already?</p>
                    <p className="board-subtitle">Add your cute cat's picture here to join our purr friends!</p>
                </div>

                <div className="board-wrap">
                    <div className="board" ref={boardRef}>
                        {isLoading && (
                            <p className="loading-text">loading purr board...</p>
                        )}
                        {!isLoading && cats.length === 0 && (
                            <div className="empty-state">
                                <p>no cats yet! be the first to add yours 🐾</p>
                            </div>
                        )}
                        {cats.map((cat, index) => (
                            <CatSticker key={cat.ts || index} cat={cat} boardRef={boardRef} />
                        ))}
                    </div>

                    <button className="add-btn" onClick={handleAddClick} aria-label="Add cat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>

            </div>

            {isModalVisible && (
                <div className="modal-overlay visible">
                    <div className="modal">
                        <p className="modal-title">add your cat 🐱</p>
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
                            placeholder="your cat's name..."
                            maxLength="30"
                            value={catName}
                            onChange={(e) => setCatName(e.target.value)}
                        />
                        <input
                            className="note-input"
                            type="text"
                            placeholder="cat's personality (e.g., playful, sleepy)..."
                            maxLength="30"
                            value={personality}
                            onChange={(e) => setPersonality(e.target.value)}
                        />
                        <input
                            className="note-input"
                            type="text"
                            placeholder="add a note about your cat..."
                            maxLength="40"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
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

const CatSticker = ({ cat, boardRef }) => {
    const stickerRef = useRef(null)

    useEffect(() => {
        if (!stickerRef.current || !boardRef.current) return

        const boardRect = boardRef.current.getBoundingClientRect()
        const w = boardRect.width || 300
        const h = boardRect.height || 400

        const size = cat.size || Math.floor(Math.random() * 40 + 80)
        const x = cat.x !== undefined ? cat.x * w : Math.random() * (w - size - 20) + 10
        const y = cat.y !== undefined ? cat.y * h : Math.random() * (h - size - 60) + 10
        const rot = cat.rot !== undefined ? cat.rot : (Math.random() * 20 - 10)

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
            <img
                src={cat.img}
                alt="Cat"
                onError={(e) => {
                    console.error('Failed to load cat image:', cat.img);
                    e.target.style.display = 'none';
                    // Show a placeholder
                    const placeholder = document.createElement('div');
                    placeholder.style.cssText = 'width: 100%; height: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 24px; border-radius: 8px; border: 2px solid #111;';
                    placeholder.textContent = '??';
                    e.target.parentNode.appendChild(placeholder);
                }}
            />
            <div className="cat-info">
                {cat.name && (
                    <p className="cat-name">{cat.name}</p>
                )}
                {cat.personality && (
                    <p className="cat-personality">{cat.personality}</p>
                )}
                {cat.note && (
                    <p className="cat-note">{cat.note}</p>
                )}
            </div>
        </div>
    )
}

export default Catboard
