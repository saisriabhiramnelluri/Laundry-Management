exports.isStudent = function(req, res, next) {
    if (req.session.user && req.session.user.role === 'student') {
        return next();
    }
    req.flash('error', 'You must be logged in as a student');
    return res.redirect('/student/login');
};

exports.isManager = function(req, res, next) {
    if (req.session.user && req.session.user.role === 'manager') {
        return next();
    }
    req.flash('error', 'You must be logged in as a manager');
    return res.redirect('/manager/login');
};
