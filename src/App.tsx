import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages";
import Layout from "./modules/Layout";
import Dashboard from "./pages/dashboard";
import Invoice from "./pages/invoice";
import Receipt from "./pages/receipt";
// import Credit from "./pages/credit";
import ProtectedRoute from "./components/ProtectedRoute";
import Category from "./pages/category";
import Brand from "./pages/brand";
import Users from "./pages/users";
import Products from "./pages/products";
import OTP from "./pages/otp";
import Stores from "./pages/stores";
import SalesManagement from "./pages/Sales";
import SetPassword from "./pages/set-password";
import ProductDetails from "./pages/productDetails";
import Inventory from "./pages/inventory";
import PendingItems from "./pages/pendingItems";
import Attributes from "./pages/attributes";
import ResellersSale from "./pages/resellersSale";
import ResellersRecord from "./pages/ResellersRecord";
import Accessories from "./pages/accessories";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/otp" element={<OTP />} />
				<Route path="complete-invitation" element={<SetPassword />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route
					path="/*"
					element={
						<ProtectedRoute>
							<Layout>
								<Routes>
									<Route path="/dashboard" element={<Dashboard />} />
									<Route path="/invoice" element={<Invoice />} />
									<Route path="/invoice/:id" element={<Receipt />} />
									<Route path="/product/:id" element={<ProductDetails />} />
									<Route
										path="/resellers-record"
										element={<ResellersRecord />}
									/>
									<Route path="/resellers-sale" element={<ResellersSale />} />
									<Route path="/category" element={<Category />} />
									<Route path="/brands" element={<Brand />} />
									<Route path="/users" element={<Users />} />
									<Route path="/products" element={<Products />} />
									<Route path="/attributes" element={<Attributes />} />
									<Route path="/inventory" element={<Inventory />} />
									<Route path="/pending-items" element={<PendingItems />} />
									<Route path="/stores" element={<Stores />} />
									<Route path="/sale" element={<SalesManagement />} />
									<Route path="/accessories" element={<Accessories />} />
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
