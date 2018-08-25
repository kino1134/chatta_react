import React, { Component } from 'react';

class Authenticate extends Component {
  render() {
    return (
      <div className="Authenticate">
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

