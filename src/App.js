import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import LuncherList from './components/LuncherList';
import CreateLuncher from './components/CreateLuncher';

const httpLink = new HttpLink({
  uri: 'https://api.graph.cool/simple/v1/cjdb5e1vs08060177myktkk5q'
});
const wsLink = new WebSocketLink({
  uri: `wss://subscriptions.us-west-2.graph.cool/v1/cjdb5e1vs08060177myktkk5q`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Horizon Lunchers</h1>
        </header>
        <p className="App-intro">
          Fill in the form below to set your lunch status!
        </p>
        <ApolloProvider client={client}>
          <LuncherList />
        </ApolloProvider>
        <ApolloProvider client={client}>
          <CreateLuncher />
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
