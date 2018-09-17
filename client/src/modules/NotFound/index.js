import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

class NotFound extends Component {
  render () {
    return (
      <section className="hero is-fullheight">
        <Helmet title="Not Found | chatta" />
        <div className="hero-body">
          ページが存在しません
        </div>
      </section>
    )
  }
}

export default NotFound
