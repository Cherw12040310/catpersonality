import React, { createContext, useContext, useEffect, useState } from 'react'

const CAT_POSITIONS = {
    '/': 0,
    '/quiz': 0.33,
    '/result': 0.60,
    '/catboard': 0.75,
    '/thank-you': 1.0,
}

const NavigationContext = createContext()

export const useNavigation = () => {
    const context = useContext(NavigationContext)
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider')
    }
    return context
}

export const NavigationProvider = ({ children }) => {
    const [currentPath, setCurrentPath] = useState('/')

    const getPosition = () => {
        return CAT_POSITIONS[currentPath] || 0
    }

    return (
        <NavigationContext.Provider value={{
            currentPath,
            setCurrentPath,
            getPosition,
            CAT_POSITIONS
        }}>
            {children}
        </NavigationContext.Provider>
    )
}
