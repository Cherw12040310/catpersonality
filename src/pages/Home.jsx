import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

const Home = () => {
    const navigate = useNavigate()

    return (
        <>
            <img src="/images/ui/1.svg" className="bg-image" alt="" />

            <div className="home-page">
                <h1 className="home-title">oh my cat</h1>
                <p className="home-subtitle">An experience design for you to feel whimsical, relax, and surrounded by cuteness of cats</p>

                <div className="home-gif-wrap">
                    <img
                        src="/images/onboarding-ui/Untitled_Artwork.gif"
                        className="home-gif"
                        alt="cat animation"
                    />
                </div>

                <button className="btn-primary home-btn" onClick={() => navigate('/onboarding')}>
                    start experience
                </button>
            </div>
        </>
    )
}

export default Home
