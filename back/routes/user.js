import { Router } from "../utils/server/server.js";

import { signin, login } from "../controllers/user.js"

const router = Router();

router.post("/signin", signin);
router.post("/login", login);

export default router;
