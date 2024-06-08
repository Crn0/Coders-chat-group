const isAuth = ( isProtectedRoute ) => (req, res, next) => {
    if(isProtectedRoute) {
        if(req.isAuthenticated()) return next();

        const error = new Error('You are not authorized to view this resource');
        error.status = 401;

        return next(error);
    }

    return next();
};

const ifAuth = (cb) => (req, res, next) => {
    if(req.isAuthenticated()) {
        if(typeof cb === 'function') {

            return cb();
        } else {
            const error = new Error('expected a callback')

            return next(error);
        }
        
    }

    return next();
}; 

const isMemberOrAdmin = (req, res, next) => {
    if(req.user.member || req.user.admin) return next();

    const error = new Error('You are not authorized to view this resource because you are not a member');
    error.status = 401;

    return next(error);
};

export {
    isAuth,
    isMemberOrAdmin,
    ifAuth,
};