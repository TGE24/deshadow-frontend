import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import OTPInput from "react-otp-input";

import Button from "../components/Button";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useAuth } from "../hooks/useAuth";
import { useLoginWith2FaMutation, UserRole } from "../generated/graphql";

const TwoFactorAuthentication = () => {
	const navigate = useNavigate();

	// Stores and hooks
	const { authPayload } = useAuthStore();
	const { setUser } = useUserStore();
	const { login: loginToken } = useAuth();

	// GraphQL mutation
	const [login, { loading }] = useLoginWith2FaMutation();

	// Local state
	const [showOtpForm, setShowOtpForm] = useState(false);
	const [otp, setOTP] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	// Redirect if no 2FA setup data
	useEffect(() => {
		if (!authPayload?.twoFactorSecret || !authPayload?.twoFactorQRCodeURL) {
			navigate("/");
		}
	}, [authPayload?.twoFactorSecret, authPayload?.twoFactorQRCodeURL, navigate]);

	const handleOtpChange = (value: string) => {
		setOTP(value);
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
						setUser(user as any); // Type casting due to GraphQL type mismatch

						// Navigate based on user role
						const navigationPath =
							user.role === UserRole.Admin ? "/users" : "/dashboard";
						navigate(navigationPath);
					}
				},
				onError(error) {
					setErrorMessage(
						error.message || "Verification failed. Please try again."
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
			<div className="bg-[#F8F8F8] rounded-[20px] w-full md:w-[710px]  px-[20px] py-[40px] md:p-[70px] lg:px-[125px]">
				<h1 className="text-[22px] md:text-[26px] font-bold text-center">
					Set up Two-Factor Authentication
				</h1>

				{!showOtpForm && (
					<div className="text-center flex flex-col gap-[20px] items-center mt-[24px]">
						<p className="text-[14px] text-[#6A6A6A]">
							To enable 2FA, you’ll have to install an authenticator app on your
							phone, and scan the QR code below.
						</p>
						{authPayload?.twoFactorQRCodeURL && (
							<QRCodeCanvas
								size={200}
								value={authPayload?.twoFactorQRCodeURL}
								level={"Q"}
							/>
						)}
						<p style={{ maxWidth: "100%" }}>
							Can’t scan the QR code? Configure your app with this key:
						</p>
						<p className="py-[12px] px-[24px] bg-[#f7f7f7] border-[1px] border-dashed border-[bfbfbf] rounded-[8px] text-[16px] break-all text-center font-bold">
							{authPayload?.twoFactorSecret ?? ""}
						</p>
						<Button
							size="large"
							className="w-full mt-[20px]"
							onClick={() => setShowOtpForm(true)}
						>
							Continue →
						</Button>
					</div>
				)}
				{showOtpForm && (
					<div className="text-center flex flex-col gap-[20px] items-center mt-[40px]">
						<h2 className="text-[20px] font-semibold text-black">
							Enter Verification Code
						</h2>
						<div className="flex items-center justify-center">
							<OTPInput
								numInputs={6}
								value={otp}
								onChange={handleOtpChange}
								shouldAutoFocus
								renderSeparator={<div className="mx-[6px] md:mx-[10px]">-</div>}
								inputStyle={
									"!size-[40px] md:!w-[52px] md:!h-[52px] border !border-[#E5E9F1] !rounded-[10px] !bg-[f3f4f633] !text-[1a1a1a] font-bold text-center text-[16px] md:!text-[20px]"
								}
								renderInput={(props, index) => <input {...props} key={index} />}
								inputType="number"
							/>
						</div>

						<p className="text-center text-red-600 text-[14px] mt-[20px]">
							{errorMessage}
						</p>
						<Button
							size="large"
							className="w-full mt-[20px]"
							onClick={onSubmit}
							disabled={loading || otp.length < 6}
						>
							{loading ? "Submitting..." : "Submit"}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default TwoFactorAuthentication;
