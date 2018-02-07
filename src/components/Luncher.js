import React, { Component } from 'react';

class Luncher extends Component {
  render() {
    return (
      <div>
        {this.props.luncher.name}{' '}
        {this.props.luncher.hasLunch ? 'has lunch' : "doesn't have lunch"}
      </div>
    );
  }
}

export default Luncher;
