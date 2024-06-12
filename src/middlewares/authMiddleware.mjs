const isAuthProtectedRoute = (isProtectedRoute, customErrorMessage) => (req, res, next) => {
    if (isProtectedRoute) {
        if (req.isAuthenticated()) return next();

        const error = new Error(customErrorMessage || 'You are not authorized to view this resource');
        error.status = 401;

        return next(error);
    }

    return next();
};

const ifAuth =
    (cb) =>
    (...args) => {
        const req = args[0];
        const next = args[args.length - 1];

        if (req.isAuthenticated()) {
            if (typeof cb === 'function') {
                return cb(...args);
            } else {
                const error = new Error('expected a callback');

                return next(error);
            }
        }

        return next();
    };

const isMemberOrAdmin = (req, res, next) => {
    if (req.user.member || req.user.admin) return next();

    const error = new Error(
        'You are not authorized to view this resource because you are not a member'
    );
    error.status = 401;

    return next(error);
};

export { isAuthProtectedRoute, isMemberOrAdmin, ifAuth };
