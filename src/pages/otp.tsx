import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";

import Button from "../components/Button";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useAuth } from "../hooks/useAuth";
import {
	useLoginWith2FaMutation,
	useMeLazyQuery,
	UserRole,
} from "../generated/graphql";

const OTP = () => {
	const navigate = useNavigate();

	// Stores and hooks
	const { authPayload } = useAuthStore();
	const { setUser } = useUserStore();
	const { login: loginToken } = useAuth();

	// GraphQL mutation
	const [getUser] = useMeLazyQuery();
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
		if (!authPayload?.challengeToken || otp.length !== 6 || loading) {
			return;
		}

		setErrorMessage("");

		try {
			await login({
				variables: {
					challengeToken: authPayload.challengeToken,
					code: otp,
				},
				async onCompleted(data) {
					const { accessToken, refreshToken } = data.loginWith2FA;

					// First, authenticate the user
					if (accessToken && refreshToken) {
						loginToken(accessToken, refreshToken);
					}

					// Get user data and wait for the response
					const userResponse = await getUser();

					const user = userResponse.data?.me;
					// Then set user data
					if (user) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						setUser(user as any); // Type casting due to GraphQL type mismatch with ownedStores

						// Navigate based on user role
						const navigationPath =
							user.role === UserRole.Admin || user.role === UserRole.SuperAdmin
								? "/users"
								: "/dashboard";
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
	}, [
		authPayload?.challengeToken,
		otp,
		loading,
		login,
		loginToken,
		setUser,
		navigate,
		getUser,
	]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-[url('assets/login-bg.svg')] bg-cover bg-center bg-no-repeat p-[20px]">
			<div className="bg-[#F8F8F8] rounded-[20px] w-full md:w-[550px]  px-[20px] py-[40px] md:p-[70px] lg:p-[70px]">
				<Link to="/">
					<h1 className="!font-cursive text-[60px] font-bold mb-[16px] text-center leading-[70px]">
						DeShadow
					</h1>
				</Link>
				<h1 className="text-[22px] md:text-[26px] font-bold text-center">
					Enter Verification Code
				</h1>
				<p className="text-center text-[#6A6A6A]">
					Enter the OTP code from your email
				</p>

				<div className="flex flex-col items-center justify-center my-[30px] lg:my-[60px] width-full">
					<OTPInput
						numInputs={6}
						value={otp}
						onChange={handleChange}
						shouldAutoFocus
						renderSeparator={<div className="mx-[6px] md:mx-[10px]">-</div>}
						inputStyle={
							"!size-[40px] md:!w-[52px] md:!h-[52px] border !border-[#E5E9F1] !rounded-[10px] !bg-[f3f4f633] !text-[1a1a1a] font-bold text-center text-[16px] md:!text-[20px]"
						}
						renderInput={(props, index) => <input {...props} key={index} />}
						inputType="text"
					/>

					{errorMessage && (
						<div className="mt-[24px] p-[16px] bg-red-50 border border-red-200 rounded-[8px]">
							<p className="text-red-600 text-[14px] text-center">
								{errorMessage}
							</p>
						</div>
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
					{errorMessage
						? "Please correct the error and try again"
						: "Enter the 6-digit code and click 'Verify Code' to proceed"}
				</p>
			</div>
		</div>
	);
};

export default OTP;
