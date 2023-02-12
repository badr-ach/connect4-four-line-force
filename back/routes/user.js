import { Router } from "../utils/server.js";

import { signin, login, loadUser } from "../controllers/user.js"
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/signin", signin);
router.post("/login", login);
router.post("/loadUser", auth, loadUser);

export default router;
