import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const retryLink = new RetryLink({
	delay: {
		initial: 300,
		max: Infinity,
		jitter: true,
	},
	attempts: {
		max: 2,
		retryIf: (error) => !!error,
	},
});

// Auth link to add token to headers
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("accessToken");

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const uploadLink = createUploadLink({
	uri: `${import.meta.env.VITE_ENV_GRAPHQL_API_BASE_URL}/query`,
	credentials: "include",
});

const client = new ApolloClient({
	cache: new InMemoryCache(),
	ssrMode: typeof window === "undefined",
	link: from([authLink, retryLink, uploadLink]),
});

export default client;
