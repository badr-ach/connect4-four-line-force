import { Router } from "../utils/express/server.js";

import { signin, login, loadUser, befriend, unfriend, rejectfriend} from "../controllers/user.js"
import auth from "../middlewares/auth.js";
import {history} from "../controllers/history.js";

const router = Router();

router.post("/signup", signin);
router.post("/login", login);
router.post("/loadUser", auth, loadUser);
router.post("/history", auth ,history);
router.post("/befriend", auth, befriend);
router.post("/unfriend", auth, unfriend);
router.post("/rejectfriend", auth, rejectfriend);


export default router;
