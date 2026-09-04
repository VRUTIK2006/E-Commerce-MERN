import express from "express";
import { allUsers, registerUser,verifyOTP, userLogin } from "../controllers/userController.js";
import { protect , admin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register',registerUser);
router.post("/verify-otp", verifyOTP);
router.post('/login',userLogin);
router.get('/allusers',protect,admin,allUsers);


export default router;