import React, { Component } from 'react';
import socket from '../services/socket'
// import GitHubLogin from 'react-github-login';
// import GoogleLogin from 'react-google-login';

import config from '../constants'
import { openPopup, listenPopup } from '../services/oAuthLogin'

class Trial extends Component {

  constructor(props) {
    super(props)
    this.state = {
      t: "",
      m: "",
      message: [],
      s: null
    }
  }

  connect(e) {
    if (this.state.s) {
      return
    }
    socket.open()
    this.setState({s: socket})

    socket.on('test', (data) => {
      const arr = this.state.message.slice()
      arr.push(data)
      this.setState({ message: arr })
    })
  }

  disconnect() {
    if (!this.state.s) {
      return
    }
    this.state.s.close()
    this.setState({s: null})
  }

  componentDidMount() {
    fetch(config.api.uri + '/hellos/5b77fe400162f504e541081b').then(res => {
      res.json().then(json => {
        console.log(json)
        this.setState({
          t: json.id,
          m: json.message
        })
      })
    })
  }

  oAuthLogin(e, endpoint) {
    const popup = openPopup(config.api.uri + endpoint)
    listenPopup(popup)
      .then((value) => {
        console.log(value)
      })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    console.log(this.state.s)
    // const onSuccess = response => console.log(response);
    // const onFailure = response => console.error(response);
    // const responseGoogle = (response) => {
    //     console.log(response);
    // }

    return (
      <div className="Authenticate">
        <div>
          {this.state.t} - {this.state.m}
        </div>
        {this.state.message.map(e => {
          return (
            <div>
              {e.message}
            </div>
          )
        })}
        {/* <button onClick={(e) => this.connect(e)} disabled={!!this.state.s}>接続</button> */}
        {/* <button onClick={(e) => this.disconnect(e)} disabled={!this.state.s}>切断</button> */}
        <button className="button" onClick={(e) => this.connect(e)}>接続</button>
        <button className="button" onClick={(e) => this.disconnect(e)}>切断</button>
        <button className="button" onClick={(e) => this.oAuthLogin(e, '/auth/google')}>Googleログイン</button>
        <button className="button" onClick={(e) => this.oAuthLogin(e, '/auth/github')}>GitHubログイン</button>
        {/* <GitHubLogin clientId="7458e855d20c735d4a38"
          redirectUri="http://localhost:3003/api/auth/github"
          onSuccess={onSuccess}
          onFailure={onFailure}/>
       <GoogleLogin
          clientId="292602580848-ted6k3hhkn5op7ehfsq0ovt1tumg6soq.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        /> */}
        <div>
          {process.env.REACT_APP_API_ROOT}
        </div>
        <div>
          Authenticate
        </div>
      </div>
    );
  }
}

export default Trial

