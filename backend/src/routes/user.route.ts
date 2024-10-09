import { Request, Response, Router } from "express";

const router = Router();

router.route("/").get((req: Request, res: Response) => {
    res.send("Hello I am user route");
});


export default router;