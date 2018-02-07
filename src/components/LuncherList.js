import React, { Component } from 'react';
import Luncher from './Luncher';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { filterer } from '../helpers/today.js';

const ALL_LUNCHERS_QUERY = gql`
  query TodaysLunchers($lunchDay: DateTime!) {
    allLunchers(filter: { date: $lunchDay }) {
      id
      name
      hasLunch
      date
    }
  }
`;

const LUNCHERS_SUBSCRIPTION = gql`
  subscription LunchSub($lunchDay: DateTime!) {
    Luncher(filter: { mutation_in: [CREATED], node: { date: $lunchDay } }) {
      mutation
      node {
        name
        id
        hasLunch
        date
      }
    }
  }
`;

class LuncherList extends Component {
  componentDidMount() {
    this.props.todaysLunchersQuery.subscribeToMore({
      document: LUNCHERS_SUBSCRIPTION,
      variables: {
        lunchDay: filterer
      },
      updateQuery: (prev, { subscriptionData }) => {
        const newLunchers = [
          ...prev.allLunchers,
          subscriptionData.data.Luncher.node
        ];
        const result = {
          ...prev,
          allLunchers: newLunchers
        };
        return result;
      }
    });
  }
  render() {
    if (
      this.props.todaysLunchersQuery &&
      this.props.todaysLunchersQuery.loading
    ) {
      return <div>Loading ...</div>;
    }

    if (
      this.props.todaysLunchersQuery &&
      this.props.todaysLunchersQuery.error
    ) {
      return <div>Error occurred</div>;
    }

    const allLunchers = this.props.todaysLunchersQuery.allLunchers;
    if (allLunchers.length === 0) {
      return <div>No lunchers...</div>;
    }

    return (
      <div>
        {allLunchers.map(luncher => (
          <Luncher key={luncher.id} luncher={luncher} />
        ))}
      </div>
    );
  }
}

export default graphql(ALL_LUNCHERS_QUERY, {
  name: 'todaysLunchersQuery',
  options: {
    variables: {
      lunchDay: filterer
    }
  }
})(LuncherList);
