import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { filterer } from '../helpers/today.js';
import Cookies from 'js-cookie';

class CreateLuncher extends Component {
  constructor(props) {
    let tester = Cookies.get('hasInputted');
    super(props);
    this.state = {
      name: '',
      hasLunch: false,
      date: filterer,
      disabled: tester
    };
  }

  render() {
    return (
      <div>
        <br />
        {this.state.disabled ? null : (
          <div>
            <input
              name="name"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Name"
            />
            <br />
            <input
              name="hasLunch"
              id="hasLunch"
              checked={this.state.hasLunch}
              onChange={e => this.setState({ hasLunch: e.target.checked })}
              type="checkbox"
            />
            <label for="hasLunch"> Do you have lunch?</label>
            <br />
            <br />
            <button onClick={() => this._createLuncher()}>Submit</button>
          </div>
        )}
      </div>
    );
  }

  _createLuncher = async () => {
    const { name } = this.state;
    const { hasLunch } = this.state;
    const { date } = this.state;
    Cookies.set('hasInputted', '1', { expires: 0.5 });
    this.setState({
      name: '',
      disabled: true
    });
    await this.props.createLuncherMutation({
      variables: {
        name,
        hasLunch,
        date
      }
    });
  };
}

const CREATE_LUNCHER_MUTATION = gql`
  mutation CreateLuncherOnLunchDay(
    $hasLunch: Boolean!
    $name: String!
    $date: DateTime!
  ) {
    createLuncher(name: $name, hasLunch: $hasLunch, date: $date) {
      id
    }
  }
`;

// 3
export default graphql(CREATE_LUNCHER_MUTATION, {
  name: 'createLuncherMutation'
})(CreateLuncher);
