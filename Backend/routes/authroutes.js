import express from "express"
import { signup } from "../controllers/authcontrollers.js";
import { login } from "../controllers/authcontrollers.js";
import { logout } from "../controllers/authcontrollers.js";
import { getMe } from "../controllers/authcontrollers.js";
import protectRoute from "../middleware/protectroute.js";

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/me",protectRoute,getMe )
export  default router;