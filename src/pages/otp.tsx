import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";

import Button from "../components/Button";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useAuth } from "../hooks/useAuth";
import { useLoginWith2FaMutation, UserRole } from "../generated/graphql";

const OTP = () => {
	const navigate = useNavigate();

	// Stores and hooks
	const { authPayload } = useAuthStore();
	const { setUser } = useUserStore();
	const { login: loginToken } = useAuth();

	// GraphQL mutation
	const [login, { loading }] = useLoginWith2FaMutation();

	// Local state
	const [otp, setOTP] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	// Redirect if no challenge token
	useEffect(() => {
		if (!authPayload?.challengeToken) {
			navigate("/");
		}
	}, [authPayload?.challengeToken, navigate]);

	const handleChange = (otp: string) => {
		setOTP(otp);
		setErrorMessage("");
	};

	const onSubmit = useCallback(async () => {
		if (!authPayload?.challengeToken || otp.length !== 6) {
			return;
		}

		setErrorMessage("");

		try {
			await login({
				variables: {
					challengeToken: authPayload.challengeToken,
					code: otp,
				},
				onCompleted(data) {
					const { accessToken, refreshToken, user } = data.loginWith2FA;

					// First, authenticate the user
					if (accessToken && refreshToken) {
						loginToken(accessToken, refreshToken);
					}

					// Then set user data
					if (user) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						setUser(user as any); // Type casting due to GraphQL type mismatch with ownedStores

						// Navigate based on user role
						const navigationPath =
							user.role === UserRole.Admin ? "/users" : "/dashboard";
						navigate(navigationPath);
					}
				},
				onError(error) {
					setErrorMessage(
						error.message || "Authentication failed. Please try again."
					);
				},
			});
		} catch {
			setErrorMessage("An unexpected error occurred. Please try again.");
		}
	}, [authPayload?.challengeToken, otp, login, loginToken, setUser, navigate]);

	useEffect(() => {
		if (otp.length === 6 && !loading) {
			onSubmit();
		}
	}, [otp, loading, onSubmit]);
	return (
		<div className="min-h-screen flex items-center justify-center bg-[url('assets/login-bg.svg')] bg-cover bg-center bg-no-repeat p-[20px]">
			<div className="bg-[#F8F8F8] rounded-[20px] w-full md:w-[710px]  px-[20px] py-[40px] md:p-[70px] lg:p-[70px]">
				<h1 className="text-[22px] md:text-[26px] font-bold text-center">
					Enter Verification Code
				</h1>
				<p className="text-center text-[#6A6A6A]">
					Enter the Authentication code from your authenticator app
				</p>

				<div className="flex flex-col items-center justify-center my-[60px]">
					<OTPInput
						numInputs={6}
						value={otp}
						onChange={handleChange}
						shouldAutoFocus
						renderSeparator={<div className="mx-[10px]">-</div>}
						inputStyle={{
							width: "52px",
							height: "52px",
							border: "1px solid #E5E9F1",
							borderRadius: "10px",
							background: "rgba(243, 244, 246, 0.2)",
							color: "#1a1a1a",
							fontWeight: "bold",
							fontSize: "20px",
							textAlign: "center",
						}}
						renderInput={(props, index) => <input {...props} key={index} />}
						inputType="tel"
					/>

					{errorMessage && (
						<p className="text-center text-red-600 text-[14px] mt-[20px] max-w-[400px]">
							{errorMessage}
						</p>
					)}
				</div>

				<Button
					size="large"
					className="w-full mt-[20px]"
					onClick={onSubmit}
					disabled={loading || otp.length !== 6}
				>
					{loading ? "Verifying..." : "Verify Code"}
				</Button>

				<p className="text-center text-[#6A6A6A] text-[14px] mt-[16px]">
					Code will be submitted automatically when complete
				</p>
			</div>
		</div>
	);
};

export default OTP;
