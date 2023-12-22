import { changeUser, createUserWithCompany, createUserWithoutCompany, getUsersPage, verifyUser } from '../../services/authentication/users.js';
import { errorResponse, jsonResponse } from '../../server.js';
import { getAllUsersInCompany } from '../../models/user.js';
import { getAllUsersAndCompanies } from '../../models/company.js';

export { usersRouter };

/**
 * Receives all routes from the main router that contain auth
 */
async function usersRouter(req, res) {
    let pathname = req.url.path.split('/users')[1];

    if(pathname.includes('/verify')) {
        await verifyUser(req, res);
        return;
    }

    if(pathname.includes('/signup')) {
        let user = JSON.parse(req.body);
        if(user.companyOrPrivate === 'private') {
            await createUserWithoutCompany(user, res);
        }else if(user.companyOrPrivate === 'company') {
            await createUserWithCompany(user, res);
        }

        return;
    }

    if(req.headers.authorization.role !== 'worker') {
        if (pathname.includes('/change')) {
            await changeUser(req, res);
            return;
        }

        if (pathname.includes('/getUsers')) {
            await getUsersPage(res, req.headers.authorization.role, req.headers.authorization.companyID);
            return;
        }
    }else{
        errorResponse(res, 500, 'Not authorized');
    }
}