import React, { Component } from 'react'
import api from '../../services/api'

class OAuthCallback extends Component {

  constructor (props) {
    super(props)

    this.state = {
      token: ""
    }
  }

  componentDidMount () {
    const { provider } = this.props.match.params
    const url = '/api/auth/' + provider + window.location.search
    api.get(url).then(res => {
      if (res.ok) {
        res.json().then(json => {
          this.setState({ token: json.token })
        }).catch(err => {
          console.log(err)
          window.close()
        })
      } else {
        window.close()
      }
    }).catch(err => {
        console.log(err)
      window.close()
    })
  }

  render () {
    return (
      <span>しばらくお待ち下さい..
        <form id="oauth" name="oauth" action="">
          <input type="hidden" name="token" value={this.state.token} />
        </form>
      </span>
    )
  }

}

export default OAuthCallback
