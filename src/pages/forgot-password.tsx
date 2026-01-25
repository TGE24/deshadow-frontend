import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Button from "../components/Button";
import Input from "../components/Input";
import { useRequestPasswordResetMutation } from "../generated/graphql";
import { toast } from "react-toastify";

interface RequestPasswordForm {
	email: string;
}

const ForgotPassword = () => {
	const navigate = useNavigate();

	// GraphQL mutation
	const [requestPasswordReset, { loading }] = useRequestPasswordResetMutation();

	// Local state
	const [errorMessage, setErrorMessage] = useState("");
	// Form management
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RequestPasswordForm>({
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (formData: RequestPasswordForm) => {
		setErrorMessage("");

		try {
			await requestPasswordReset({
				variables: {
					input: formData,
				},
				onCompleted() {
					toast.success(
						"A reset link has been sent to the email address provided.",
					);
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
						{loading ? "Sending..." : "Send Reset Link"}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
