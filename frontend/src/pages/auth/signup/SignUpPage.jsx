import { Link } from "react-router-dom";
import { useState } from "react";
import XSvg from "../../../components/svgs/X";

import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullname: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullname, password }) => {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, username, fullname, password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to create account");
			toast.success("Account created successfully");
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 text-white flex items-center justify-center px-4">
			<div className="flex w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl bg-opacity-20 backdrop-blur-md bg-black">
				<div className="hidden lg:flex items-center justify-center flex-1 bg-black bg-opacity-20 p-10">
					<XSvg className="w-64 fill-green-500" />
				</div>

				<div className="flex-1 p-8 md:p-12">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="lg:hidden flex justify-center mb-4">
							<XSvg className="w-16 fill-green-500" />
						</div>
						<h2 className="text-3xl font-bold text-green-400">Create your account</h2>

						<div className="space-y-4">
							<label className="flex items-center gap-3 border border-green-600 bg-black bg-opacity-30 px-4 py-2 rounded-lg focus-within:ring-2 ring-green-500">
								<MdOutlineMail className="text-green-400" />
								<input
									type="email"
									name="email"
									placeholder="Email"
									className="bg-transparent focus:outline-none w-full text-white"
									value={formData.email}
									onChange={handleInputChange}
								/>
							</label>

							<div className="flex gap-4 flex-wrap">
								<label className="flex-1 flex items-center gap-3 border border-green-600 bg-black bg-opacity-30 px-4 py-2 rounded-lg focus-within:ring-2 ring-green-500">
									<FaUser className="text-green-400" />
									<input
										type="text"
										name="username"
										placeholder="Username"
										className="bg-transparent focus:outline-none w-full text-white"
										value={formData.username}
										onChange={handleInputChange}
									/>
								</label>
								<label className="flex-1 flex items-center gap-3 border border-green-600 bg-black bg-opacity-30 px-4 py-2 rounded-lg focus-within:ring-2 ring-green-500">
									<MdDriveFileRenameOutline className="text-green-400" />
									<input
										type="text"
										name="fullname"
										placeholder="Full Name"
										className="bg-transparent focus:outline-none w-full text-white"
										value={formData.fullname}
										onChange={handleInputChange}
									/>
								</label>
							</div>

							<label className="flex items-center gap-3 border border-green-600 bg-black bg-opacity-30 px-4 py-2 rounded-lg focus-within:ring-2 ring-green-500">
								<MdPassword className="text-green-400" />
								<input
									type="password"
									name="password"
									placeholder="Password"
									className="bg-transparent focus:outline-none w-full text-white"
									value={formData.password}
									onChange={handleInputChange}
								/>
							</label>
						</div>

						<button
							type="submit"
							className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-2 rounded-full font-semibold"
						>
							{isPending ? "Creating..." : "Sign Up"}
						</button>

						{isError && <p className="text-red-500">{error.message}</p>}

						<p className="mt-6 text-center text-sm text-white">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-green-400 hover:underline font-medium"
							>
								Log in
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
