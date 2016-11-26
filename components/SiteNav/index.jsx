import React from 'react'
import { RouteHandler, Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import './style.css'

class SiteNav extends React.Component {
    render() {
        const {location} = this.props
        return (
            <nav className='blog-nav'>
              <ul>
                <li>
                  <Link to="/" className={ location.pathname === prefixLink('/') ? "current" : null }> Articles
                  </Link>
                </li>
                <li>
                  <Link to="/about/" className={ location.pathname === prefixLink('/about/') ? "current" : null }> About me
                  </Link>
                </li>
              </ul>
              <hr />
              <p>
                Some of my projects
              </p>
              <ul>
                <li>
                  <a href="http://tadeuzagallo.com/verve-lang">
                    Verve (programming language)
                  </a>
                </li>
                <li>
                  <a href="http://tadeuzagallo.com/">
                    zsh.js
                  </a>
                </li>
                <li>
                  <a href="http://tadeuzagallo.com/GithubPulse">
                    Github Pulse
                  </a>
                </li>
              </ul>
            </nav>
            );
    }
}

SiteNav.propTypes = {
    location: React.PropTypes.object,
}

export default SiteNav
