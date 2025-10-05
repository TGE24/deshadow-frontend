import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "http://104.248.67.41:8080/query",
	documents: "**/*.graphql",
	generates: {
		"src/generated/graphql.ts": {
			plugins: [
				"typescript",
				"typescript-operations",
				"typescript-react-apollo",
			],
			config: {
				withHooks: true,
			},
		},
	},
};

export default config;
