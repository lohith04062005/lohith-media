import express from "express"
import protectRoute from "../middleware/protectroute.js";
import { getProfile,followUnFollowUser, getSuggestedUsers, updateUser } from "../controllers/usercontroller.js";
const router = express.Router();
router.get("/profile/:username",protectRoute, getProfile)
router.post("/follow/:id",protectRoute, followUnFollowUser)
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/update",updateUser)

export default router;