import express from "express";
import { allUsers, registerUser, userLogin } from "../controllers/userController.js";
import { protect , admin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',userLogin);
router.get('/allusers',protect,admin,allUsers);


export default router;