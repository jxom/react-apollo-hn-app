import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import logger from 'redux-logger';
import persistState from 'redux-localstorage';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-client-preset';
import _get from 'lodash/get';

import { GC_URL } from './constants';
import App from 'containers/App';
import reducer from 'reducers';
import registerServiceWorker from 'utils/service-worker';

const httpLink = new HttpLink({ uri: GC_URL });

const enhancer = compose(
  applyMiddleware(logger),
  persistState(['user'], {
    key: 'hn-redux'
  })
);
const store = createStore(reducer, {}, enhancer);

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = _get(store.getState(), 'user.token');
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  });
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
