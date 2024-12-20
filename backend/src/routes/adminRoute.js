import { Router } from "express";
import multer from "multer";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import AdminController from "../controllers/adminController.js";

const router = Router();

let imageName;
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    imageName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "-" +
      file.originalname.trim();
    cb(null, imageName);
  },
});

const upload = multer({ storage: storage });

const adminController = new AdminController();

router.get("/user/:userId", adminMiddleware, adminController.fetchSingleUser);
router.get(
  "/order/:orderId",
  adminMiddleware,
  adminController.fetchSingleOrder
);
router.get("/users", adminMiddleware, adminController.fetchUsers);
router.get("/orders", adminMiddleware, adminController.fetchOrders);
router.get("/payments", adminMiddleware, adminController.getAllPayments);

router.get(
  "/addProduct",
  adminMiddleware,
  upload.array("product", 5),
  adminController.addProduct
);

router.put(
  "/userStatus/:userId",
  adminMiddleware,
  adminController.changeUserStatus
);

router.put(
  "/changeOrderStatus",
  adminMiddleware,
  adminController.changeOrderStatus
);

export default router;
