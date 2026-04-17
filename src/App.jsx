import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NavigationProvider } from './contexts/NavigationContext'
import Navigation from './components/Navigation'
import Onboarding from './pages/Onboarding'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Catboard from './pages/Catboard'
import ThankYou from './pages/ThankYou'
import './App.css'
import './styles/shared.css'

function App() {
    return (
        <NavigationProvider>
            <Router>
                <div className="app">
                    <Navigation />
                    <Routes>
                        <Route path="/" element={<Onboarding />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/result" element={<Result />} />
                        <Route path="/catboard" element={<Catboard />} />
                        <Route path="/thank-you" element={<ThankYou />} />
                    </Routes>
                </div>
            </Router>
        </NavigationProvider>
    )
}

export default App
