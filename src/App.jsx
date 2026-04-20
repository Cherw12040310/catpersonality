import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { NavigationProvider } from './contexts/NavigationContext'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Catboard from './pages/Catboard'
import Final from './pages/Final'
import './App.css'
import './styles/shared.css'

const NO_NAV_ROUTES = ['/', '/onboarding']

function AppContent() {
    const location = useLocation()
    const showNavigation = !NO_NAV_ROUTES.includes(location.pathname)

    return (
        <div className="app">
            {showNavigation && <Navigation />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/result" element={<Result />} />
                <Route path="/catboard" element={<Catboard />} />
                <Route path="/final" element={<Final />} />
            </Routes>
        </div>
    )
}

function App() {
    return (
        <NavigationProvider>
            <Router>
                <AppContent />
            </Router>
        </NavigationProvider>
    )
}

export default App
