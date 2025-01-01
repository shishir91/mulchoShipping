import multer from "multer";
import { Router } from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import AdminController from "../controllers/adminController.js";

const router = Router();

// Configure multer storage with destination and filename
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "-" +
      file.originalname.trim();
    cb(null, uniqueName);
  },
});

// File validation (optional)
const fileFilter = (req, file, cb) => {
  // Accept only certain file types (e.g., images)
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only images are allowed!"), false);
  }
};

// Initialize multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB size limit
  fileFilter: fileFilter,
});

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

router.put("/products", adminMiddleware, adminController.editProduct);
router.delete("/products", adminMiddleware, adminController.deleteProduct);
router.post(
  "/changeProductStatus",
  adminMiddleware,
  adminController.changeProductStatus
);
router.post(
  "/addProduct",
  adminMiddleware,
  upload.array("productImages", 5), // Matches "productImages" from frontend
  (req, res) => {
    console.log("Request fields:", req.body); // Logs additional form data
    console.log("Request files:", req.files); // Logs uploaded files
    adminController.addProduct(req, res);
  }
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
