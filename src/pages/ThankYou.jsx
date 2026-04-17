import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ThankYou.css'

const ThankYou = () => {
  const navigate = useNavigate()

  const handleRestart = () => {
    // Clear any stored quiz data
    sessionStorage.removeItem('catResult')
    navigate('/')
  }

  return (
    <>
      <img src="/images/ui/1.svg" className="bg-image" alt="" />
      
      <div className="page">
        <div className="thank-you-card">
          <div className="thank-you-icon">
            <img src="/images/ui/cat-happy.svg" alt="Happy cat" />
          </div>
          
          <h1 className="thank-you-title">Thank You!</h1>
          
          <p className="thank-you-text">
            Thanks for taking the cat personality quiz! 
            We hope you had fun discovering your feline match.
          </p>
          
          <p className="thank-you-subtext">
            Feel free to explore your cat board or take the quiz again to discover other cat personalities!
          </p>
          
          <div className="button-group">
            <button className="btn-primary" onClick={() => navigate('/catboard')}>
              View Cat Board
            </button>
            
            <button className="btn-outline" onClick={handleRestart}>
              Take Quiz Again
            </button>
          </div>
          
          <div className="cat-paws">
            <img src="/images/ui/paw-print.svg" className="paw paw-1" alt="" />
            <img src="/images/ui/paw-print.svg" className="paw paw-2" alt="" />
            <img src="/images/ui/paw-print.svg" className="paw paw-3" alt="" />
          </div>
        </div>
      </div>
    </>
  )
}

export default ThankYou
