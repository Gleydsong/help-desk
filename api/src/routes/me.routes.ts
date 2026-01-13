import { Router } from "express";
import multer from "multer";
import { uploadConfig } from "../config/upload";
import { deleteMe, getMe, updateMe, uploadAvatar } from "../controllers/meController";
import { ensureAuth } from "../middlewares/ensureAuth";

const router = Router();
const upload = multer({ storage: uploadConfig.storage });

router.use(ensureAuth);
router.get("/", getMe);
router.put("/", updateMe);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.delete("/", deleteMe);

export const meRoutes = router;
