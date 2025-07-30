import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";

import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="min-h-screen flex">
			{/* Left panel for logo */}
			<div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-black text-green-400">
				<XSvg className="w-2/3 mb-6" />
				<h2 className="text-4xl font-bold">Welcome Back!</h2>
				<p className="mt-4 text-lg text-green-300 px-8 text-center">
					Login to continue exploring your feed and connecting with others.
				</p>
			</div>

			{/* Right panel for form */}
			<div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-gradient-to-br from-black to-green-950 p-8">
				<XSvg className="w-20 lg:hidden mb-4" />
				<h1 className="text-3xl font-extrabold text-green-400 mb-4">Let's go.</h1>

				<form
					onSubmit={handleSubmit}
					className="w-full max-w-sm flex flex-col gap-4 bg-black bg-opacity-30 p-6 rounded-xl shadow-xl"
				>
					<label className="input input-bordered flex items-center gap-2 bg-black text-green-200">
						<MdOutlineMail className="text-green-400" />
						<input
							type="text"
							name="username"
							className="grow bg-transparent placeholder:text-green-500"
							placeholder="Username"
							value={formData.username}
							onChange={handleInputChange}
						/>
					</label>

					<label className="input input-bordered flex items-center gap-2 bg-black text-green-200">
						<MdPassword className="text-green-400" />
						<input
							type="password"
							name="password"
							className="grow bg-transparent placeholder:text-green-500"
							placeholder="Password"
							value={formData.password}
							onChange={handleInputChange}
						/>
					</label>

					<button className="btn bg-green-500 hover:bg-green-600 text-black font-bold rounded-full mt-2">
						{isPending ? "Logging in..." : "Login"}
					</button>

					{isError && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
				</form>

				<div className="mt-6 text-center text-green-300">
					<p className="mb-2">Don't have an account?</p>
					<Link to="/signup">
						<button className="btn btn-outline border-green-500 text-green-400 hover:bg-green-500 hover:text-black rounded-full">
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
