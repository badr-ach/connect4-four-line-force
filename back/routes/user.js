import { Router } from "../utils/server/server";

import { signin, login } from "../controllers/users.js";

const router = Router();

router.post("/signin", signin);
router.post("/login", login);

export default router;
