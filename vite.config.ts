import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: true, // Allow external connections
		port: 8080,
	},
	preview: {
		host: true, // Allow external connections in preview mode
		allowedHosts: ["staging.de-shadow.com", "localhost", "de-shadow.com"], // Allow staging domain
	},
});
