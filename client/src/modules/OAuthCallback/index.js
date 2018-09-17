import React, { Component } from 'react'
import api from '../../services/api'

import RoomLoading from '../RoomLoading'

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
    api.getJson(url).then(res => {
      if (res.ok) {
        this.setState({ token: res.data.token })
      } else {
        console.log(res.data)
      }
    }).catch(err => {
      console.log(err)
    }).then(() => window.close())
  }

  render () {
    return (
      <RoomLoading>
        <form id="oauth" name="oauth" action="">
          <input type="hidden" name="token" value={this.state.token} />
        </form>
      </RoomLoading>
    )
  }
}

export default OAuthCallback
