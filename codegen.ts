import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
	overwrite: true,
	schema: `${process.env.VITE_ENV_GRAPHQL_API_BASE_URL}/query`,
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
