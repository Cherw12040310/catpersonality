import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import '../styles/Onboarding.css'

const Onboarding = () => {
    const navigate = useNavigate()
    const [screen, setScreen] = useState('story') // 'story', 'entering', 'confirm'
    const [currentSlide, setCurrentSlide] = useState(0)

    const pathRef = useRef(null)
    const catWrapRef = useRef(null)
    const sceneRef = useRef(null)
    const animationRef = useRef(null)

    const BASE = '/images/onboarding-ui/'

    const SLIDES = [
        {
            lines: ["Too bright, too fast,", "too many thoughts..."],
            cat: 'cat screen one.svg',
            catClass: '',
            doodles: [
                { src: 'swirl one.svg', style: { width: '10vw', maxWidth: '80px', top: '8%', left: '58%' } },
                { src: 'swirl two.svg', style: { width: '10vw', maxWidth: '80px', top: '50%', left: '40%', transform: 'translate(-50%,-50%)' } },
                { src: 'swirl three.svg', style: { width: '10vw', maxWidth: '80px', top: '80%', left: '30%', transform: 'translate(-50%,-50%)' } },
                { src: 'line one.svg', style: { width: '14vw', maxWidth: '110px', top: '30%', right: '8%' } },
                { src: 'line one.svg', style: { width: '14vw', maxWidth: '110px', top: '50%', left: '10%' } },
                { src: 'line two.svg', style: { width: '12vw', maxWidth: '95px', top: '15%', left: '5%' } },
                { src: 'line two.svg', style: { width: '12vw', maxWidth: '95px', bottom: '30%', right: '5%' } },
            ],
            textClass: '',
            tapHint: true,
            enterBtn: false
        },
        {
            lines: ["Shall we find a space", "where we can just... be..."],
            cat: 'cat screen two.svg',
            catClass: 'center-bottom',
            doodles: [
                { src: 'heart one.svg', style: { width: '8vw', maxWidth: '55px', top: '8%', left: '18%' } },
                { src: 'heart 3.svg', style: { width: '7vw', maxWidth: '52px', top: '10%', right: '12%' } },
                { src: 'heart 2.svg', style: { width: '7vw', maxWidth: '52px', top: '38%', right: '8%' } },
                { src: 'heart one.svg', style: { width: '7vw', maxWidth: '50px', bottom: '18%', left: '10%' } },
                { src: 'heart 3.svg', style: { width: '6vw', maxWidth: '48px', bottom: '8%', left: '18%' } },
                { src: 'thinking.svg', style: { width: '28vw', maxWidth: '200px', bottom: '28%', right: '7%' } },
            ],
            textClass: 'left-mid',
            tapHint: true,
            enterBtn: false
        },
        {
            lines: ["cozy and safe, no worries, no thoughts"],
            cat: 'cat screen three.svg',
            catClass: 'large',
            doodles: [
                { src: 'heart one.svg', style: { width: '8vw', maxWidth: '55px', top: '10%', left: '18%' } },
                { src: 'sparkle.svg', style: { width: '6vw', maxWidth: '45px', top: '12%', left: '42%' } },
                { src: 'heart 3.svg', style: { width: '7vw', maxWidth: '52px', top: '18%', right: '12%' } },
                { src: 'heart one.svg', style: { width: '6vw', maxWidth: '48px', bottom: '28%', right: '8%' } },
                { src: 'sparkle 2.svg', style: { width: '6vw', maxWidth: '44px', bottom: '22%', left: '10%' } },
            ],
            textClass: 'center-mid',
            tapHint: true,
            enterBtn: false
        },
        {
            lines: ["Welcome to the Purr House", "cats are waiting to meet you.", "Get matched and adopt one!"],
            cat: 'purr house.svg',
            catClass: 'large',
            doodles: [
                { src: 'cloud 1.svg', style: { width: '20vw', maxWidth: '130px', top: '5%', left: '5%' } },
                { src: 'cloud 2.svg', style: { width: '20vw', maxWidth: '120px', top: '5%', right: '5%' } },
                { src: 'cloud 1.svg', style: { width: '20vw', maxWidth: '100px', top: '12%', left: '40%', transform: 'translateX(-50%)' } },
            ],
            textClass: 'center',
            tapHint: false,
            enterBtn: true
        }
    ]

    const handleStoryClick = () => {}

    const handleBack = (e) => {
        e.stopPropagation()
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1)
        } else {
            navigate('/')
        }
    }

    const handleNext = (e) => {
        e.stopPropagation()
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1)
        } else {
            handleEnterHome()
        }
    }

    const handleEnterHome = () => {
        setScreen('entering')
        setTimeout(() => {
            startPathAnimation()
        }, 600)
    }

    const startPathAnimation = () => {
        if (!pathRef.current || !catWrapRef.current) return

        const path = pathRef.current
        const catWrap = catWrapRef.current
        const scene = sceneRef.current
        const pathSvg = path.parentElement

        let startTime = null
        const DURATION = 2800

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp
            const elapsed = timestamp - startTime
            const progress = Math.min(elapsed / DURATION, 1)

            const pathLength = path.getTotalLength()
            const point = path.getPointAtLength(progress * pathLength)
            const nextPoint = path.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength))
            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI)

            const svgRect = pathSvg.getBoundingClientRect()
            const svgEl = pathSvg
            const viewBox = svgEl.viewBox.baseVal

            const scaleX = svgRect.width / viewBox.width
            const scaleY = svgRect.height / viewBox.height

            const screenX = svgRect.left + point.x * scaleX
            const screenY = svgRect.top + point.y * scaleY

            const catSize = catWrap.offsetWidth

            catWrap.style.position = 'fixed'
            catWrap.style.left = (screenX - catSize / 2) + 'px'
            catWrap.style.top = (screenY - catSize / 2) + 'px'
            catWrap.style.transform = `rotate(${angle}deg)`

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                if (scene && scene.classList) {
                    scene.classList.add('fade-out')
                }
                setTimeout(() => {
                    setScreen('confirm')
                }, 700)
            }
        }

        animationRef.current = requestAnimationFrame(animate)
    }

    const handleConfirm = () => {
        navigate('/quiz')
    }

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    if (screen === 'story') {
        const slide = SLIDES[currentSlide]

        return (
            <>
                <img src="/images/ui/1.svg" className="bg-image" alt="" />

                <div className="story-screen" onClick={handleStoryClick}>
                    <div className="story-nav">
                        <button className="story-nav-btn" onClick={handleBack}>
                            <img src="/images/ui/back.svg" alt="back" />
                            <span>back</span>
                        </button>
                        <button className="story-nav-btn" onClick={handleNext}>
                            <img src="/images/ui/continue.svg" alt="continue" />
                            <span>continue</span>
                        </button>
                    </div>
                    <div className="story-card">
                        <div id="doodleLayer">
                            {slide.doodles.map((doodle, index) => {
                                // console.log('Doodle style:', doodle.style);
                                return (
                                    <img
                                        key={index}
                                        src={BASE + doodle.src}
                                        className="doodle"
                                        style={doodle.style}
                                        alt=""
                                    />
                                )
                            })}
                        </div>

                        <img
                            className={`cat-img ${slide.catClass}`}
                            src={BASE + slide.cat}
                            alt="cat"
                        />

                        <p className={`story-text ${slide.textClass}`}>
                            {slide.lines.map((line, index) => (
                                <span key={index}>{line}{index < slide.lines.length - 1 && <br />}</span>
                            ))}
                        </p>


                        {slide.enterBtn && (
                            <button className="btn-filled enter-btn" onClick={handleEnterHome}>
                                Enter home
                            </button>
                        )}

                        <div className="dots">
                            {SLIDES.map((_, index) => (
                                <div
                                    key={index}
                                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (screen === 'entering') {
        return (
            <>
                <img src="/images/ui/1.svg" className="bg-image" alt="" />

                <div className="scene" ref={sceneRef}>
                    <svg className="path-svg" viewBox="0 0 500 160" xmlns="http://www.w3.org/2000/svg">
                        <path
                            ref={pathRef}
                            id="curvePath"
                            className="path-line"
                            d="M 20 100 C 80 20, 140 140, 220 80 S 360 20, 440 80"
                        />
                        <image
                            href="/images/ui/home.svg"
                            x="440"
                            y="48"
                            width="60"
                            height="60"
                        />
                    </svg>

                    <div className="cat-wrap" ref={catWrapRef}>
                        <img src="/images/onboarding-ui/loadingcat.png" alt="cat" />
                    </div>

                    <p className="entering-text">entering the purr house</p>
                </div>
            </>
        )
    }

    if (screen === 'confirm') {
        return (
            <>
                <img src="/images/ui/1.svg" className="bg-image" alt="" />
                <Navigation />

                <div className="page">
                    <div className="outer-card">
                        <div className="card-icon">
                            <img src="/images/ui/catwithnote.svg" alt="Quiz Icon" />
                        </div>
                        <p className="card-text">
                            Let's match a companion for you. Let's get start by taking some quick questions to match vibes
                        </p>
                        <button className="btn-primary" onClick={handleConfirm}>
                            Purr-sue
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return null
}

export default Onboarding
