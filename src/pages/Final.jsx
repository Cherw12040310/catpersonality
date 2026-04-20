import { useNavigate } from 'react-router-dom'
import '../styles/Final.css'
import '../styles/shared.css'

const Final = () => {
    const navigate = useNavigate()

    return (
        <>
            <img src="/images/ui/1.svg" className="bg-image" alt="" />

            <div className="final-page">
                <img src="/images/ui/cats.svg" className="final-cats-img" alt="cats" />

                <div className="final-text-wrap">
                    <p className="final-text">
                        Now that entered the home of Purr House. It is time bring it to life.
                    </p>
                    <p className="final-text">
                        Grab the tablet on the table to check them out in AR form
                    </p>
                </div>

                <button className="btn-primary final-btn" onClick={() => navigate('/')}>
                    Complete experience
                </button>
            </div>
        </>
    )
}

export default Final
