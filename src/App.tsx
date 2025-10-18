import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages";
import Layout from "./modules/Layout";
import Dashboard from "./pages/dashboard";
import Invoice from "./pages/invoice";
import Receipt from "./pages/receipt";
import Credit from "./pages/credit";
import ProtectedRoute from "./components/ProtectedRoute";
import Category from "./pages/category";
import Brand from "./pages/brand";
import Users from "./pages/users";
import Products from "./pages/products";
import TwoFactorAuthentication from "./pages/TwoFactorAuthSetup";
import OTP from "./pages/otp";
import Stores from "./pages/stores";
import Inventory from "./pages/inventory";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/setup-2fa" element={<TwoFactorAuthentication />} />
				<Route path="/otp" element={<OTP />} />
				<Route
					path="/*"
					element={
						<ProtectedRoute>
							<Layout>
								<Routes>
									<Route path="/dashboard" element={<Dashboard />} />
									<Route path="/invoice" element={<Invoice />} />
									<Route path="/invoice/:id" element={<Receipt />} />
									<Route path="/credit" element={<Credit />} />
									<Route path="/category" element={<Category />} />
									<Route path="/brands" element={<Brand />} />
									<Route path="/users" element={<Users />} />
									<Route path="/products" element={<Products />} />
									<Route path="/stores" element={<Stores />} />
									<Route path="/inventory" element={<Inventory />} />
								</Routes>
							</Layout>
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
