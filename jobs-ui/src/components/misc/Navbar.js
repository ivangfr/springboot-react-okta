import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { withAuth } from '@okta/okta-react'
import M from 'materialize-css'

class Navbar extends Component {
  state = {
    authenticated: null,
    user: null
  }

  async componentDidMount() {
    this.checkAuthentication()

    const sidenav = document.querySelectorAll('.sidenav')
    M.Sidenav.init(sidenav)
  }

  async componentDidUpdate() {
    this.checkAuthentication()
  }

  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated()
    if (authenticated !== this.state.authenticated) {
      const user = await this.props.auth.getUser()
      this.setState({
        authenticated,
        user
      })
    }
  }

  logHandleLogInOut = async () => {
    this.state.authenticated ? this.props.auth.logout('/') : this.props.auth.login('/')
  }

  render() {
    const linkVisibility = this.state.authenticated ? {"display": "block"} : {"display": "none"}
    const username = this.state.authenticated && this.state.user.preferred_username
    const logInOut = this.state.authenticated ? "Logout" : "Login"
    return (
      <div>
        <div className="navbar-fixed">
          <nav className="light-blue darken-4">
            <div className="nav-wrapper container">
              <Link to="/" className="brand-logo">Jobs Portal</Link>
              <a href="/" data-target="mobile-menu" className="sidenav-trigger">
                <i className="material-icons">menu</i>
              </a>
              <ul id="nav" className="right hide-on-med-and-down">
                <li className="light-blue darken-3">{username}</li>
                <li><NavLink exact to="/">Home</NavLink></li>
                <li><NavLink exact to="/customer" style={linkVisibility}>Customer</NavLink></li>
                <li><NavLink exact to="/staff" style={linkVisibility}>Staff</NavLink></li>
                <li><NavLink exact to="/login" onClick={this.logHandleLogInOut}>{logInOut}</NavLink></li>
              </ul>
            </div>
          </nav>
        </div>

        <ul id="mobile-menu" className="sidenav">
          <li><Link to="/" className="sidenav-close">Home</Link></li>
          <li><Link to="/customer" className="sidenav-close">Customer</Link></li>
          <li><Link to="/staff" className="sidenav-close">Staff</Link></li>
          <li><Link to="/" onClick={this.logHandleLogInOut}>{logInOut}</Link></li>
        </ul>
      </div>
    )
  }
}

export default withAuth(Navbar)