import React, { Component } from 'react';
import socket from './socket'

class Authenticate extends Component {

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
    fetch(process.env.REACT_APP_API_ROOT + '/hellos/5b77fe400162f504e541081b').then(res => {
      res.json().then(json => {
        console.log(json)
        this.setState({
          t: json.id,
          m: json.message
        })
      })
    })
  }

  render() {
    console.log(this.state.s)
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
        <button onClick={(e) => this.connect(e)}>接続</button>
        <button onClick={(e) => this.disconnect(e)}>切断</button>
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

export default Authenticate

