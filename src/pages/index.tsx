import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Button from "../components/Button";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";
import { LoginMutation, useLoginMutation } from "../generated/graphql";

interface LoginFormData {
	email: string;
	password: string;
}

const Login = () => {
	const navigate = useNavigate();

	// Stores and hooks
	const { setAuthPayload } = useAuthStore();
	const { login: authLogin } = useAuth();

	// GraphQL mutation
	const [login, { loading }] = useLoginMutation();

	// Local state
	const [errorMessage, setErrorMessage] = useState("");
	// Form management
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (formData: LoginFormData) => {
		setErrorMessage("");

		try {
			await login({
				variables: {
					input: formData,
				},
				onCompleted(data: LoginMutation) {
					const { login: loginData } = data;

					// Case 1: User needs to set up 2FA (first time)
					if (loginData.twoFactorSecret) {
						setAuthPayload({
							twoFactorSecret: loginData.twoFactorSecret,
							accessToken: loginData.accessToken ?? "",
							refreshToken: loginData.refreshToken ?? "",
							requires2FA: loginData.requires2FA,
							challengeToken: loginData.challengeToken ?? "",
							twoFactorQRCodeURL: loginData.twoFactorQRCodeURL ?? "",
						});
						navigate("/setup-2fa");
						return;
					}

					// Case 2: User has 2FA enabled and needs to enter OTP
					if (loginData.requires2FA && loginData.challengeToken) {
						setAuthPayload({
							accessToken: loginData.accessToken ?? "",
							refreshToken: loginData.refreshToken ?? "",
							challengeToken: loginData.challengeToken,
							requires2FA: loginData.requires2FA,
						});
						navigate("/otp");
						return;
					}

					// Case 3: Successful login without 2FA requirements
					if (loginData.accessToken && loginData.refreshToken) {
						authLogin(loginData.accessToken, loginData.refreshToken);
						navigate("/dashboard");
						return;
					}

					// Fallback error
					setErrorMessage("Login failed. Please try again.");
				},
				onError(error) {
					setErrorMessage(
						error.message ||
							"Login failed. Please check your credentials and try again."
					);
				},
			});
		} catch {
			setErrorMessage("An unexpected error occurred. Please try again.");
		}
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-[url('assets/login-bg.svg')] bg-cover bg-center bg-no-repeat p-[20px]">
			<div className="bg-[#F8F8F8] rounded-[20px] w-full max-w-[550px] px-[20px] py-[40px] md:p-[60px] shadow-lg">
				<h1 className="!font-cursive text-[60px] font-bold mb-[16px] text-center leading-[70px]">
					DeShadow
				</h1>
				<div className="text-center mb-[40px]">
					<h1 className="text-[24px] md:text-[28px] font-bold text-gray-900 mb-[4px]">
						Welcome back
					</h1>
					<p className="text-[#6A6A6A] text-[16px] md:tracking-[0.03em]">
						Please enter your details to sign in to your account
					</p>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-[16px]"
				>
					<Input
						label="Email"
						placeholder="Enter your email"
						type="email"
						register={register("email", {
							required: "Email is required",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Please enter a valid email address",
							},
						})}
						errors={errors.email}
					/>
					<Input
						label="Password"
						placeholder="Enter your password"
						type="password"
						register={register("password", {
							required: "Password is required",
							minLength: {
								value: 6,
								message: "Password must be at least 6 characters",
							},
						})}
						errors={errors.password}
					/>

					{errorMessage && (
						<div className="mt-[24px] p-[16px] bg-red-50 border border-red-200 rounded-[8px]">
							<p className="text-red-600 text-[14px] text-center">
								{errorMessage}
							</p>
						</div>
					)}

					<Button
						variant="primary"
						size="large"
						className="w-full mt-[24px]"
						disabled={loading}
					>
						{loading ? "Signing in..." : "Sign In"}
					</Button>
				</form>

				<div className="mt-[16px] text-center">
					<Button
						as="link"
						variant="outline"
						className="text-[#278783] hover:text-[#1f6663] text-[14px] font-medium py-0"
					>
						Forgot your password?
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Login;
