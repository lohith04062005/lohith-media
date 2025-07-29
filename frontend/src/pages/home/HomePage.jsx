import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<div className='flex-[4_4_0] mr-auto min-h-screen border-r border-gray-800 bg-black text-white'>

			{/* Header Tabs */}
			<div className='flex border-b border-gray-800 sticky top-0 z-20 bg-black/80 backdrop-blur-sm'>
				{["forYou", "following"].map((tab) => (
					<div
						key={tab}
						onClick={() => setFeedType(tab)}
						className={`flex-1 text-center py-4 cursor-pointer font-semibold text-sm sm:text-base tracking-wide relative transition-all duration-200 
							hover:bg-[#1a1a1a]
							${feedType === tab ? "text-white" : "text-gray-400"}
						`}
					>
						{tab === "forYou" ? "For You" : "Following"}
						{feedType === tab && (
							<span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-primary rounded-full shadow-md' />
						)}
					</div>
				))}
			</div>

			{/* Create Post Box */}
			<div className='border-b border-gray-800 px-4 py-3'>
				<CreatePost />
			</div>

			{/* Posts Feed */}
			<div className='pb-16'>
				<Posts feedType={feedType} />
			</div>
		</div>
	);
};

export default HomePage;
