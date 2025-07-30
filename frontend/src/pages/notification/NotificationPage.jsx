import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
	const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`);
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Something went wrong");
	return data;
},

	});

	const { mutate: deleteNotifications } = useMutation({
	mutationFn: async () => {
	const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, { method: "DELETE" });
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Something went wrong");
	return data;
},

		onSuccess: () => {
			toast.success("All notifications cleared");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className='flex-[4_4_0] min-h-screen border-x border-gray-800 bg-black text-white'>

			{/* Header */}
			<div className='flex justify-between items-center px-5 py-4 border-b border-gray-800 sticky top-0 bg-black/80 z-10 backdrop-blur-sm'>
				<h2 className='text-xl font-bold'>Notifications</h2>

				<div className='dropdown dropdown-end'>
					<div tabIndex={0} role='button' className='p-2 rounded-full hover:bg-gray-900 transition'>
						<IoSettingsOutline className='w-5 h-5 text-gray-300' />
					</div>
					<ul tabIndex={0} className='dropdown-content z-[1] menu p-2 bg-gray-900 rounded-lg w-56 shadow-md'>
						<li>
							<a onClick={deleteNotifications} className='text-sm text-red-500'>
								Delete all notifications
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className='flex justify-center items-center h-52'>
					<LoadingSpinner size='lg' />
				</div>
			)}

			{/* No Notifications */}
			{!isLoading && notifications?.length === 0 && (
				<div className='text-center text-gray-400 py-8 font-semibold'>
					No notifications yet 🤔
				</div>
			)}

			{/* Notifications List */}
			<div className='divide-y divide-gray-800'>
				{notifications?.map((notification) => (
					<div key={notification._id} className='px-5 py-4 hover:bg-gray-900 transition'>

						<div className='flex items-start gap-3'>
							{/* Icon */}
							<div className='pt-1'>
								{notification.type === "follow" && <FaUser className='text-primary w-5 h-5' />}
								{notification.type === "like" && <FaHeart className='text-red-500 w-5 h-5' />}
							</div>

							{/* User info */}
							<Link to={`/profile/${notification.from.username}`} className='flex gap-3 items-center'>
								<div className='avatar'>
									<div className='w-9 rounded-full ring ring-gray-700'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>

								<div className='text-sm'>
									<p>
										<span className='font-bold text-white'>
											@{notification.from.username}
										</span>{" "}
										<span className='text-gray-400'>
											{notification.type === "follow" ? "followed you" : "liked your post"}
										</span>
									</p>
								</div>
							</Link>
						</div>

					</div>
				))}
			</div>
		</div>
	);
};

export default NotificationPage;
