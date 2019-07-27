import React from 'react';
import App, { Container } from 'next/app';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';

import { ApolloProvider } from 'react-apollo';

import fetch from 'isomorphic-fetch';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const JWT_TOKEN = '1140553';

const myFetch = (url, opts) => {
  return fetch(url, {
    ...opts,
    headers: { ...opts.headers, jwt: JWT_TOKEN }
  });
};

const link = createLink();

function createLink() {
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  const httpLink = new HttpLink({
    uri: 'http://graphql-workshop-2019.herokuapp.com/graphql',
    fetch: myFetch
  });

  if (!process.browser) return httpLink;

  const wsLink = new WebSocketLink({
    uri: 'ws://graphql-workshop-2019.herokuapp.com',
    options: {
      reconnect: true,
      connectionParams: { jwt: JWT_TOKEN }
    }
  });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  return split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );
}

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
        ,
      </Container>
    );
  }
}

export default MyApp;
