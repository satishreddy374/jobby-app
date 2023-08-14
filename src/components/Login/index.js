import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', isLoginFailed: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = error => {
    this.setState({isLoginFailed: true, errorMsg: error})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      this.onSubmitSuccess(data.jwt_token)
    } else {
      const data = await response.json()
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, isLoginFailed, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-image"
          />
          <form
            className="login-details-container"
            onSubmit={this.onSubmitForm}
          >
            <label htmlFor="username" className="label-text">
              USERNAME
            </label>
            <input
              id="username"
              className="input-text"
              type="text"
              placeholder="Username"
              value={username}
              onChange={this.onChangeUsername}
            />
            <label htmlFor="password" className="label-text">
              PASSWORD
            </label>
            <input
              id="password"
              className="input-text"
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {isLoginFailed && <p className="error-text">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
