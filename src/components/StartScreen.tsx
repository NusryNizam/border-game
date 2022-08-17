import '../styles/StartScreen.css'
import Splash from '../images/splash.svg'
import { Link } from 'react-router-dom'

export const StartScreen = () => {
    return (
        <div className='StartScreen'>
            <img src={Splash} className='splash-image' alt="welcome" />
            <Link to='/start'>
                <button className='btn btn-start'>Start</button>
            </Link>
        </div>
    )
}