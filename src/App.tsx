import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages";
import Layout from "./modules/Layout";
import Dashboard from "./pages/dashboard";

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
							</Routes>
						</Layout>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
