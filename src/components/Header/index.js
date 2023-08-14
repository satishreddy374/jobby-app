import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBagFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <div className="logo-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-image"
          />
        </Link>
      </div>
      <ul className="home-jobs-path-desktop-view">
        <Link to="/" className="paths-text">
          <li className="list-item">Home</li>
        </Link>
        <Link to="/jobs" className="paths-text">
          <li className="list-item">Jobs</li>
        </Link>
      </ul>
      <ul className="home-jobs-path-mobile-view">
        <li className="list-item">
          <Link to="/" className="home-icon-path">
            <AiFillHome size={30} color="#ffffff" />
          </Link>
        </li>
        <li className="list-item">
          <Link to="/jobs">
            <BsFillBagFill size={26} color="#ffffff" />
          </Link>
        </li>
      </ul>
      <button
        onClick={onClickLogoutButton}
        type="button"
        className="logout-desktop-button"
      >
        Logout
      </button>
      <button
        type="button"
        onClick={onClickLogoutButton}
        className="logout-mobile-button"
      >
        <FiLogOut size={26} color="#ffffff" />
      </button>
    </div>
  )
}
export default withRouter(Header)
