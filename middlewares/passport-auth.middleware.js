export class PassportAuthMiddleware {
    static authenticate(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        
        res.redirect('/error');
    }
}
