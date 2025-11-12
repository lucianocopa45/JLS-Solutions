import express  from 'express';
import * as controller from '../controllers/user.controller.js';
import { validatorCreate } from '../validators/user.validator.js';
import { login } from '../controllers/auth.controller.js';
import { authorizeRole } from '../middlewares/authz.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', login);

router.get("/getAllUser", auth,authorizeRole(["USUARIO", "ADMIN"]), controller.getAllUser);
router.post('/createUser', authorizeRole(["ADMIN"]),controller.postUser);
router.post("/createUserDb", authorizeRole(["ADMIN"]),validatorCreate,controller.postUserDb);
router.get("/getByIdUser/:id", auth,authorizeRole(["ADMIN"]), controller.getUserById);
router.put("/putUser/:id", auth,authorizeRole(["ADMIN"]),controller.putUser);
router.delete("/deleteUser/:id", authorizeRole(["ADMIN"]),controller.deleteUser);

export default router;
