import { fileResponse } from '../server.js';

export { signupRouter };

async function signupRouter(req, res) {
    let pathname = req.url.path.split('/signup')[1];

    if (pathname.includes('/?page=verify')) {
        fileResponse('/signupPages/verifyUser.html', res);
        return;
    }

    if (pathname.includes('/?page=joinCompany')) {
        fileResponse('/signupPages/join-company.html', res);
        return;
    }

    if (pathname.includes('/?page=createCompany')) {
        fileResponse('/signupPages/create-company.html', res);
        return;
    }

    if (pathname.includes('/page=complete')) {
        fileResponse('/signupPages/complete.html', res);
        return;
    }

    fileResponse('/signupPages/signup.html', res);
}