import { Router } from "../utils/express/server.js";

import { signin, login, loadUser } from "../controllers/user.js"
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/signup", signin);
router.post("/login", login);
router.post("/loadUser", auth, loadUser);


export default router;
