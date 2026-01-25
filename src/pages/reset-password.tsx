import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import Button from "../components/Button";
import Input from "../components/Input";
import { useResetPasswordMutation } from "../generated/graphql";
import { toast } from "react-toastify";

interface LoginFormData {
	confirmPassword: string;
	password: string;
}

const ResetPassword = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	// GraphQL mutation
	const [resetPassword, { loading }] = useResetPasswordMutation();

	// Local state
	const [errorMessage, setErrorMessage] = useState("");
	const [userData, setUserData] = useState<{
		email: string;
		token: string;
	}>({ email: "", token: "" });

	// Form management
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<LoginFormData>({
		defaultValues: {
			confirmPassword: "",
			password: "",
		},
		mode: "onChange",
		reValidateMode: "onChange",
	});

	// Get data from query params and set it
	useEffect(() => {
		const data = searchParams.get("data");
		if (data) {
			setUserData(JSON.parse(atob(data)));
		}
	}, [searchParams]);

	const onSubmit = async (formData: LoginFormData) => {
		setErrorMessage("");

		try {
			await resetPassword({
				variables: {
					input: {
						...userData,
						newPassword: formData.password,
					},
				},
				onCompleted() {
					toast.success("Your password has been reset successfully.");
					navigate("/");
				},
				onError(error) {
					setErrorMessage(error.message);
				},
			});
		} catch {
			setErrorMessage("An unexpected error occurred. Please try again.");
		}
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-[url('assets/login-bg.svg')] bg-cover bg-center bg-no-repeat p-[20px]">
			<div className="bg-[#F8F8F8] rounded-[20px] w-full max-w-[550px] px-[20px] py-[40px] md:p-[60px] shadow-lg">
				<Link to="/">
					<h1 className="!font-cursive text-[60px] font-bold mb-[16px] text-center leading-[70px]">
						DeShadow
					</h1>
				</Link>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-[16px]"
				>
					<Input
						label="New Password"
						placeholder="Enter your new password"
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
					<Input
						label="Confirm Password"
						placeholder="Enter your password again"
						type="password"
						register={register("confirmPassword", {
							required: "Confirm Password is required",
							minLength: {
								value: 6,
								message: "Confirm Password must be at least 6 characters",
							},
							validate: (value) => {
								if (value !== watch("password")) {
									return "Passwords do not match";
								}
								return true;
							},
						})}
						errors={errors.confirmPassword}
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
						{loading ? "Signing in..." : "Continue"}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
