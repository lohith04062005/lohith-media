import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: true, // ⬅️ Must be true for HTTPS (Render)
		sameSite: "None", // ⬅️ Critical for cross-site cookie sharing
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
	});
};

export default generateToken;
