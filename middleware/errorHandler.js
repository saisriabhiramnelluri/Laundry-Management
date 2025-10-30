module.exports = (err, req, res, next) => {
    const { status = 500, message = 'Something went wrong!' } = err;
    console.error('Error:', err);
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.status(status).json({ error: message });
    } else {
        res.status(status).render('error', { 
            status, 
            message,
            title: 'Error'
        });
    }
};
