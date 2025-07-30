import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img }) => {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text, img }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='bg-[#0f0f0f] border-b border-gray-700 p-4 flex items-start gap-4'>
			{/* Avatar */}
			<div className='avatar'>
				<div className='w-10 h-10 rounded-full'>
					<img src={authUser?.profileImg || "/avatar-placeholder.png"} alt='avatar' />
				</div>
			</div>

			{/* Form Section */}
			<form onSubmit={handleSubmit} className='flex flex-col gap-3 w-full'>

				{/* Textarea */}
				<textarea
					className='bg-transparent text-white placeholder-gray-500 resize-none text-lg focus:outline-none w-full min-h-[80px]'
					placeholder="What's happening?"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>

				{/* Image Preview */}
				{img && (
					<div className='relative rounded-lg overflow-hidden w-full max-w-xs mx-auto'>
						<IoCloseSharp
							className='absolute top-2 right-2 text-white bg-gray-800 rounded-full w-6 h-6 p-1 cursor-pointer hover:bg-gray-700'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} alt='preview' className='w-full max-h-72 object-cover rounded' />
					</div>
				)}

				{/* Action Row */}
				<div className='flex items-center justify-between border-t border-gray-700 pt-2'>
					<div className='flex items-center gap-3'>
						<CiImageOn
							onClick={() => imgRef.current.click()}
							className='text-xl text-primary cursor-pointer hover:scale-110 transition-transform'
						/>
						<BsEmojiSmileFill className='text-yellow-400 text-lg cursor-pointer hover:scale-110 transition-transform' />
					</div>

					<input
						type='file'
						accept='image/*'
						hidden
						ref={imgRef}
						onChange={handleImgChange}
					/>

					<button
						type='submit'
						className='bg-primary hover:bg-opacity-80 transition-colors px-6 py-2 text-white text-sm rounded-full font-semibold'
						disabled={isPending}
					>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>

				{/* Error message */}
				{isError && <p className='text-sm text-red-500'>{error.message}</p>}
			</form>
		</div>
	);
};

export default CreatePost;
