import React, { Component } from 'react';

class Authenticate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      t: "",
      m: ""
    }
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
    return (
      <div className="Authenticate">
        <div>
          {this.state.t} - {this.state.m}
        </div>
        <div>
          {process.env.REACT_APP_API_ROOT}
        </div>
        <div>
          Auth
        </div>
      </div>
    );
  }
}

export default Authenticate

