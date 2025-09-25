import Button from "../components/Button";
import Goolgle from "../components/Icons/Goolgle";
import Apple from "../components/Icons/Apple";
import Input from "../components/Input";

const Login = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[url('assets/login-bg.svg')] bg-cover bg-center bg-no-repeat p-[20px]">
			<div className="bg-[#F8F8F8] rounded-[20px] w-full md:w-[710px]  px-[20px] py-[40px] md:p-[70px] lg:px-[125px] lg:py-[116px]">
				<h1 className="text-[22px] md:text-[26px] font-bold text-center">
					Welcome back to De Shadow
				</h1>
				<p className="text-center text-[#6A6A6A] text-[16px]  md:tracking-[0.03em]">
					Please enter your details to sign in your account
				</p>
				<div className="mt-[24px] flex flex-col gap-[16px]">
					<Button variant="secondary" icon={<Goolgle />}>
						Continue with Google
					</Button>
					<Button variant="secondary" icon={<Apple />}>
						Continue with Apple
					</Button>
				</div>
				<div className="flex w-full items-center mt-[32px]">
					<hr className="border-[#D9D9D9] w-[100%]" />
					<p className="w-full text-[#696969] text-[14px] text-center">
						Or sign in with
					</p>
					<hr className="border-[#D9D9D9] w-[100%]" />
				</div>
				<div className="mt-[32px] flex flex-col gap-[24px]">
					<Input
						label="Email"
						placeholder="Enter your email"
						name="email"
						id="email"
						type="email"
					/>
					<Input
						label="Password"
						placeholder="Enter your password"
						name="password"
						id="password"
						type="password"
					/>
				</div>
				<Button variant="primary" className="w-full mt-[48px]">
					SIGN IN
				</Button>
				<Button as="link" variant="outline" className="w-full mt-[16px]">
					Forgot Password?
				</Button>
			</div>
		</div>
	);
};

export default Login;
