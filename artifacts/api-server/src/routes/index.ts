import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import carsRouter from "./cars";
import messagesRouter from "./messages";
import wishlistRouter from "./wishlist";
import modelsRouter from "./models";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(carsRouter);
router.use(messagesRouter);
router.use(wishlistRouter);
router.use(modelsRouter);

export default router;
