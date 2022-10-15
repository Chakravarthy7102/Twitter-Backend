import {Router} from 'express'

import Auth from '../controller/auth_controller'

const router = Router();
const auth = new Auth();



router.post('/register',auth.register);
router.post('/login',auth.login)
router.get('/logout',auth.logout)

export default router;