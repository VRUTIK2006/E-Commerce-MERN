import express from "express";
import { protect , admin} from "../middlewares/authMiddleware.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";
import uplaod from "../middlewares/upload.js";

const router = express.Router();

router.get('/products',getProducts);
router.get('/product/:id',getProductById);
router.post('/create-product',uplaod.array("image",5),createProduct);
router.put('/update-product/:id',updateProduct);
router.delete('/delete-product/:id',deleteProduct);

export default router;