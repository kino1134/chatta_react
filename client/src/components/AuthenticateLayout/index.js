import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

class AuthenticateLayout extends Component {
  render () {
    return (
      <section id="authenticate-layout" className="hero is-fullheight">
        <Helmet title="chatta" />
        <div className="hero-body">
          <div className="container">
            <div className="column is-6 is-offset-3">
              {this.props.children}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default AuthenticateLayout
