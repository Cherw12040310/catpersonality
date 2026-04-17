import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigation } from '../contexts/NavigationContext'
import '../styles/Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const { setCurrentPath, getPosition } = useNavigation()
  const catRef = useRef(null)

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname, setCurrentPath])

  useEffect(() => {
    const cat = catRef.current
    if (!cat) return
    
    const wrap = cat.parentElement
    const maxLeft = wrap.offsetWidth - cat.offsetWidth
    cat.style.left = (maxLeft * getPosition()) + 'px'
  }, [getPosition])

  return (
    <div className="progress-path">
      <div className="path-point">
        <img src="/images/ui/icons8-location-100.png" className="path-pin" alt="start" />
        <span className="path-label">Start</span>
      </div>
      <div className="path-svg-wrap">
        <img src="/images/ui/navline.svg" className="nav-line" alt="" />
        <img 
          ref={catRef}
          src="/images/ui/catmove.svg" 
          className="cat-move" 
          alt="cat position indicator" 
        />
      </div>
      <div className="path-point">
        <img src="/images/ui/icons8-location-100.png" className="path-pin" alt="end" />
        <span className="path-label">End</span>
      </div>
    </div>
  )
}

export default Navigation
