import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages";
import Layout from "./modules/Layout";
import Dashboard from "./pages/dashboard";
import Invoice from "./pages/invoice";
import Receipt from "./pages/receipt";
import Credit from "./pages/credit";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route
					path="/*"
					element={
						<Layout>
							<Routes>
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/invoice" element={<Invoice />} />
								<Route path="/invoice/:id" element={<Receipt />} />
								<Route path="/credit" element={<Credit />} />
							</Routes>
						</Layout>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
