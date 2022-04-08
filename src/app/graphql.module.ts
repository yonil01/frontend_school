import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from "@apollo/client/core";
import {HttpLink} from 'apollo-angular/http';
import {HttpHeaders} from '@angular/common/http';
import {EnvServiceProvider} from '@app/core/services/env/env.service.provider';
import {onError} from "@apollo/client/link/error";
import {setContext} from "@apollo/client/link/context";

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    graphQLErrors.map(({message, locations, path}) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const uri = EnvServiceProvider.useFactory().GRAPHQL_API + '/query';

// const uri = 'http://190.156.216.187:8080/querytoken'; // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8',
    },
  }));

  const auth = setContext((operation, context) => {
    return sessionStorage.getItem('Token')
      ? {headers: new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem('Token')}`),}
      : {}
  });

  return {
    link: ApolloLink.from([
      errorLink,
      basic,
      auth,
      httpLink.create({uri})
    ]),
    cache: new InMemoryCache({
      addTypename: false,
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
    queryDeduplication: false,
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
}
