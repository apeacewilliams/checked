import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { getAuth } from 'firebase/auth';
import { HttpLink } from '@apollo/client/link/http';
import { ErrorLink } from '@apollo/client/link/error';
import { SetContextLink } from '@apollo/client/link/context';
import { toast } from 'sonner';

const authLink = new SetContextLink(async (prevContext) => {
  const user = getAuth().currentUser;
  const token = user ? await user.getIdToken() : null;

  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        getAuth().signOut();
        window.location.href = '/login';
        return;
      }
    }
  } else {
    toast.error('Connection lost. Please check your network and try again.');
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    authLink,
    new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
