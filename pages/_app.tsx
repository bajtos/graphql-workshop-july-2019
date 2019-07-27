import React from 'react';
import App, { Container } from 'next/app';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { ApolloProvider } from 'react-apollo';

import fetch from 'isomorphic-fetch';

const myFetch = (url, opts) => {
  return fetch(url, {
    ...opts,
    headers: { ...opts.headers, jwt: '1140553' }
  });
};

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({
    uri: 'http://graphql-workshop-2019.herokuapp.com/graphql',
    fetch: myFetch
  }),
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
