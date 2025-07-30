import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generatetoken.js";
export const signup = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "invalid email format" })
        }
        const existingEmail = await User.findOne({ email })
        const existingUser = await User.findOne({ username })
        if (existingUser || existingEmail) {
            return res.status(400).json({ error: "Already Existing User or Email" })
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "pass must have 6 char length" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedpassword

        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(200).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,
                link: newUser.link

            })
        }
        else {
            res.status(400).json({ error: "invalid user data" })
        }

    } catch (error) {
        console.log(`Error in signup controller : ${error}`)
        res.status(500).json({ error: "internal server error " })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        const isPassWordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPassWordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link
        });
    } catch (error) {
        console.log(`error in login controller : ${error}`);
        res.status(500).json({ error: "internal server error" });
    }
};

export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", {
			httpOnly: true,
			expires: new Date(0),
			sameSite: "strict",
			secure: process.env.NODE_ENV !== "development",
		});
		res.status(200).json({ message: "logout successful" });
	} catch (error) {
		console.log(`error in logout controller : ${error}`);
		res.status(500).json({ error: "internal server error" });
	}
};


export const getMe = async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).select("-password")
        res.status(200).json(user);
    } catch (error) {

        console.log(`error in login controller : ${error}`);
        res.status(500).json({ error: "internal server error" });
    }
}