import Button from "../components/Button";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { LoginMutation, useLoginMutation } from "../generated/graphql";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Login = () => {
	const { setAuthPayload } = useAuthStore();
	const navigate = useNavigate();
	const [login, { loading }] = useLoginMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ email: string; password: string }>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: { email: string; password: string }) => {
		await login({
			variables: {
				input: data,
			},
			onCompleted(data: LoginMutation) {
				if (data.login.twoFactorSecret !== null) {
					setAuthPayload({
						twoFactorSecret: data.login.twoFactorSecret,
						accessToken: data.login.accessToken ?? "",
						refreshToken: data.login.refreshToken ?? "",
						requires2FA: data.login.requires2FA,
						challengeToken: data.login.challengeToken ?? "",
						twoFactorQRCodeURL: data.login.twoFactorQRCodeURL ?? "",
					});
					navigate("/setup-2fa");
					return;
				}
				if (data.login.twoFactorSecret === null) {
					setAuthPayload({
						accessToken: data.login.accessToken ?? "",
						refreshToken: data.login.refreshToken ?? "",
						challengeToken: data.login.challengeToken ?? "",
					});
					navigate(`/otp`);
					return;
				}
			},
			onError(error: { message: string }) {
				console.log(error.message);
			},
		});
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-[url('assets/login-bg.svg')] bg-cover bg-center bg-no-repeat p-[20px]">
			<div className="bg-[#F8F8F8] rounded-[20px] w-full md:w-[710px]  px-[20px] py-[40px] md:p-[70px] lg:p-[80px]">
				<h1 className="text-[22px] md:text-[26px] font-bold text-center">
					Welcome back to De Shadow
				</h1>
				<p className="text-center text-[#6A6A6A] text-[16px]  md:tracking-[0.03em]">
					Please enter your details to sign in your account
				</p>
				<form onSubmit={handleSubmit(onSubmit)} className="mt-[48px]">
					<div className="flex flex-col gap-[24px]">
						<Input
							label="Email"
							placeholder="Enter your email"
							type="email"
							register={register("email", {
								required: "Please Enter your Email",
							})}
							errors={errors.email}
						/>
						<Input
							label="Password"
							placeholder="Enter your password"
							type="password"
							register={register("password", {
								required: "Please Enter your Password",
							})}
							errors={errors.password}
						/>
					</div>
					<Button
						variant="primary"
						size="large"
						className="w-full mt-[48px]"
						disabled={loading}
					>
						{loading ? "Loading..." : "SIGN IN"}
					</Button>
				</form>
				<Button as="link" variant="outline" className="w-full mt-[16px]">
					Forgot Password?
				</Button>
			</div>
		</div>
	);
};

export default Login;
