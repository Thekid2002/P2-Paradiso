import { loginUser, forgotPassword } from '../../services/authentication/users.js';
import { usersRouter } from './users.js';
import { logOutToken } from '../../services/authentication/authentication.js';

export { authRouter };

/**
 * Receives all routes from the main router that contain auth
 */
async function authRouter(req, res) {
    let pathname = req.url.path.split('/auth')[1];

    if(pathname.includes('/users')) {
        usersRouter(req, res);
        return;
    }

    if(pathname.includes('/login')) {
        loginUser(req, res);
        return;
    }

    if(pathname.includes('/forgotPassword')) {
        forgotPassword(req, res);
        return;
    }

    if(pathname.includes('/logout')) {
        logOutToken(req, res);
        return;
    }
}