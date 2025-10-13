import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-responsive-modal/styles.css";
import "react-loading-skeleton/dist/skeleton.css";
import App from "./App.tsx";
import { ApolloProvider } from "@apollo/client";
import client from "./services/ApolloClient.ts";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ApolloProvider client={client}>
			<AuthProvider>
				<App />
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={true}
					newestOnTop={true}
					closeOnClick={true}
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
			</AuthProvider>
		</ApolloProvider>
	</StrictMode>
);
