import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Result.css'

const CAT_DATA = {
    american_shorthair: {
        name: 'American Shorthair',
        img: '/images/cats/americanshorthairfull.png',
        color: '#c5caf0',
        funFact: 'American Shorthairs were brought to America on the Mayflower to protect cargo from mice — they have been working cats from the very start.',
        doodles: [
            { src: '/images/onboarding-ui/cup.svg', style: 'width:18%;top:15%;left:15%;' },
            { src: '/images/onboarding-ui/meow.svg', style: 'width:28%;top:8%;right:8%;' },
            { src: '/images/onboarding-ui/swirl.svg', style: 'width:12%;bottom:10%;left:8%;' },
        ],
        traits: [
            'chill but secretly affectionate',
            'watches everything before getting involved',
            'adapts easily to new environments',
            'sleeps like it completed a long shift'
        ]
    },
    british_shorthair: {
        name: 'British Shorthair',
        img: '/images/cats/britishshorthairfull.png',
        color: '#A5BCA1',
        funFact: 'British Shorthairs are one of the oldest recorded cat breeds, dating all the way back to the domestic cats of ancient Rome.',
        doodles: [
            { src: '/images/onboarding-ui/hi.svg', style: 'width:20%;top:10%;left:10%;' },
            { src: '/images/onboarding-ui/icecream.svg', style: 'width:28%;top:8%;right:8%;' },
            { src: '/images/onboarding-ui/star.png', style: 'width:15%;bottom:20%;right:80%;' },

            { src: '/images/onboarding-ui/swirl one.svg', style: 'width:10%;top:80%;right:9%;' },
        ],
        traits: [
            'calm and collected in every situation',
            'independent but deeply loyal',
            'total homebody who loves comfort',
            'dignified and a little mysterious'
        ]
    },
    maincoon: {
        name: 'Maine Coon',
        img: '/images/cats/mainecoonfull.png',
        color: '#BC6E64',
        funFact: 'Maine Coons are the largest domestic cat breed and can take up to 4 years to fully grow — they are basically eternal kittens.',
        doodles: [
            { src: '/images/onboarding-ui/heartbubble.svg', style: 'width:30%;top:6%;right:6%;' },
            { src: '/images/onboarding-ui/star.png', style: 'width:15%;bottom:20%;right:80%;' },
            { src: '/images/onboarding-ui/swirl one.svg', style: 'width:10%;bottom:80%;left:8%;' },
        ],
        traits: [
            'adventurous and always up for something new',
            'playful energy that never runs out',
            'loves being the life of the party',
            'curious about absolutely everything'
        ]
    },
    birman: {
        name: 'Birman',
        img: '/images/cats/birmanfull.png',
        color: '#F5C2E2',
        funFact: 'Known as the Sacred Cat of Burma, legend says Birmans got their deep blue eyes as a gift from a goddess for their loyalty.',
        doodles: [
            { src: '/images/onboarding-ui/icecream.svg', style: 'width:28%;top:8%;right:8%;' },
            { src: '/images/onboarding-ui/star.png', style: 'width:15%;bottom:20%;right:80%;' },
            { src: '/images/onboarding-ui/swirl one.svg', style: 'width:10%;bottom:80%;left:8%;' },
            { src: '/images/onboarding-ui/swirl one.svg', style: 'width:10%;top:80%;right:9%;' },
        ],
        traits: [
            'gentle and deeply caring',
            'the best listener in any room',
            'people feel instantly at ease around you',
            'quiet strength and warmth'
        ]
    },
    ragdoll: {
        name: 'Ragdoll',
        img: '/images/cats/ragdollfull.png',
        color: '#D8CE9C',
        funFact: 'Ragdolls go completely limp when picked up, like a real ragdoll — that relaxed, trusting quality is literally how they got their name.',
        doodles: [
            { src: '/images/onboarding-ui/cloud.svg', style: 'width:30%;top:6%;right:6%;' },
            { src: '/images/onboarding-ui/meow.svg', style: 'width:28%;top:8%;right:8%;' },
            { src: '/images/onboarding-ui/swirl.svg', style: 'width:10%;bottom:80%;right:80%;' },
            { src: '/images/onboarding-ui/flower.svg', style: 'width:12%;bottom:10%;left:8%;' },
        ],
        traits: [
            'the most relaxed person ever',
            'super affectionate and warm',
            'goes with the flow effortlessly',
            'spreads good vibes everywhere'
        ]
    },
    tabby: {
        name: 'Tabby',
        img: '/images/cats/tabbyfull.png',
        color: '#829fcd',
        funFact: 'Tabby is not a breed — it is a coat pattern! Every tabby shares the iconic M marking on their forehead, no matter the breed.',
        doodles: [
            { src: '/images/onboarding-ui/meow2.svg', style: 'width:15%;top:8%;right:8%;' },
            { src: '/images/onboarding-ui/star.png', style: 'width:15%;bottom:20%;right:80%;' },
            { src: '/images/onboarding-ui/swirl.svg', style: 'width:10%;bottom:80%;left:8%;' },
            { src: '/images/onboarding-ui/flower.svg', style: 'width:10%;top:80%;right:9%;' },
        ],
        traits: [
            'always involved in everything',
            'endlessly curious about everyone',
            'social but does things their own way',
            'clever observer who quietly supervises'
        ]
    },
    tuxedo: {
        name: 'Tuxedo',
        img: '/images/cats/tuxedofull.png',
        color: '#7f8bb5',
        funFact: 'Tuxedo cats have been owned by Isaac Newton, Mark Twain, and even Beethoven — they have always had a thing for creative genius.',
        doodles: [
            { src: '/images/onboarding-ui/icecream.svg', style: 'width:28%;top:8%;right:8%;' },
            { src: '/images/onboarding-ui/star.png', style: 'width:15%;bottom:20%;right:80%;' },
            { src: '/images/onboarding-ui/swirl one.svg', style: 'width:10%;bottom:80%;left:8%;' },
            { src: '/images/onboarding-ui/swirl one.svg', style: 'width:10%;top:80%;right:9%;' },
        ],
        traits: [
            'walks into a room and owns it',
            'naturally charming and bold',
            'confident in every situation',
            'people are drawn to your energy'
        ]
    }
}

const Result = () => {
    const navigate = useNavigate()
    const [catData, setCatData] = useState(CAT_DATA['american_shorthair'])
    const [isSwiped, setIsSwiped] = useState(false)
    const [showSwipeHint, setShowSwipeHint] = useState(true)

    const catCardRef = useRef(null)
    const personalityCardRef = useRef(null)

    const startX = useRef(0)
    const currentX = useRef(0)
    const isDragging = useRef(false)

    useEffect(() => {
        const winnerKey = sessionStorage.getItem('catResult') || 'american_shorthair'
        const cat = CAT_DATA[winnerKey] || CAT_DATA['american_shorthair']
        setCatData(cat)

        sessionStorage.setItem('catColor', cat.color)
        sessionStorage.setItem('catImg', cat.img)
        sessionStorage.setItem('catName', cat.name)

        document.documentElement.style.setProperty('--cat-color', cat.color)
    }, [])

    const handleStart = (e) => {
        isDragging.current = true
        startX.current = e.touches ? e.touches[0].clientX : e.clientX

        if (isSwiped) {
            personalityCardRef.current.style.transition = 'none'
        } else {
            catCardRef.current.style.transition = 'none'
        }
    }

    const handleMove = (e) => {
        if (!isDragging.current) return
        e.preventDefault()

        currentX.current = (e.touches ? e.touches[0].clientX : e.clientX) - startX.current
        const rotate = currentX.current * 0.06

        if (isSwiped) {
            personalityCardRef.current.style.transform = `translateX(${currentX.current}px) rotate(${rotate}deg)`
        } else {
            catCardRef.current.style.transform = `translateX(${currentX.current}px) rotate(${rotate}deg)`
        }
    }

    const handleEnd = () => {
        if (!isDragging.current) return
        isDragging.current = false

        const threshold = 80

        if (!isSwiped) {
            catCardRef.current.style.transition = 'transform 0.5s ease, opacity 0.5s ease'
            if (Math.abs(currentX.current) > threshold) {
                setIsSwiped(true)
                catCardRef.current.style.transform = 'scale(0.92) translateY(12px)'
                catCardRef.current.style.opacity = '0.5'
                catCardRef.current.style.zIndex = '1'
                personalityCardRef.current.style.zIndex = '2'
                setShowSwipeHint(false)
            } else {
                catCardRef.current.style.transform = 'translateX(0) rotate(0deg)'
            }
        } else {
            personalityCardRef.current.style.transition = 'transform 0.5s ease, opacity 0.5s ease'
            if (Math.abs(currentX.current) > threshold) {
                setIsSwiped(false)
                personalityCardRef.current.style.transform = 'scale(0.95) translateY(10px)'
                personalityCardRef.current.style.zIndex = '1'
                catCardRef.current.style.zIndex = '2'
                catCardRef.current.style.opacity = '1'
                catCardRef.current.style.transform = 'translateX(0) rotate(0deg)'
                setShowSwipeHint(true)
            } else {
                personalityCardRef.current.style.transform = 'translateX(0) rotate(0deg) scale(1)'
            }
        }
        currentX.current = 0
    }

    const handleContinue = () => {
        navigate('/catboard')
    }

    useEffect(() => {
        const catCard = catCardRef.current
        const personalityCard = personalityCardRef.current

        const cleanup = () => {
            catCard.removeEventListener('mousedown', handleStart)
            personalityCard.removeEventListener('mousedown', handleStart)
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseup', handleEnd)
            catCard.removeEventListener('touchstart', handleStart, { passive: true })
            catCard.removeEventListener('touchmove', handleMove, { passive: false })
            catCard.removeEventListener('touchend', handleEnd)
            personalityCard.removeEventListener('touchstart', handleStart, { passive: true })
            personalityCard.removeEventListener('touchmove', handleMove, { passive: false })
            personalityCard.removeEventListener('touchend', handleEnd)
        }

        catCard.addEventListener('mousedown', handleStart)
        personalityCard.addEventListener('mousedown', handleStart)
        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mouseup', handleEnd)
        catCard.addEventListener('touchstart', handleStart, { passive: true })
        catCard.addEventListener('touchmove', handleMove, { passive: false })
        catCard.addEventListener('touchend', handleEnd)
        personalityCard.addEventListener('touchstart', handleStart, { passive: true })
        personalityCard.addEventListener('touchmove', handleMove, { passive: false })
        personalityCard.addEventListener('touchend', handleEnd)

        return cleanup
    }, [isSwiped])

    return (
        <>
            <img src="/images/ui/1.svg" className="bg-image" alt="" />

            <div className="page">
                <div className="result-content-wrap">
                <div className="card-stack">
                    <div
                        className={`result-card personality-card ${isSwiped ? 'revealed' : ''}`}
                        ref={personalityCardRef}
                    >
                        <div className="personality-inner">
                            <p className="personality-label">lifestyle habits</p>
                            <div className="traits-list">
                                {catData.traits.map((trait, index) => (
                                    <div key={index} className="trait-item">
                                        <p className="trait-text">{trait}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="result-card cat-card" ref={catCardRef}>
                        <div id="doodleLayer">
                            {catData.doodles?.map((doodle, index) => (
                                <img
                                    key={index}
                                    src={doodle.src}
                                    style={{
                                        position: 'absolute',
                                        opacity: 1,
                                        pointerEvents: 'none',
                                        ...Object.fromEntries(
                                            doodle.style.split(';').map(s => s.split(':')).filter(([k, v]) => k && v)
                                        )
                                    }}
                                    alt=""
                                />
                            ))}
                        </div>
                        <img className="cat-full-img" src={catData.img} alt={catData.name} />

                        {showSwipeHint && (
                            <p className="swipe-hint">flip to check out their lifestyle habits</p>
                        )}
                    </div>
                </div>

                <div className="title-wrap">
                    <p className="result-subtitle">You are matched with a</p>
                    <h1 className="result-name">{catData.name}</h1>
                    <p className="result-funfact">{catData.funFact}</p>
                </div>
                </div>

                <button className="btn-primary continue-btn" onClick={handleContinue}>continue</button>
            </div>
        </>
    )
}

export default Result
