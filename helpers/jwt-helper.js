const jwt = require("jsonwebtoken");

exports.authenticateToken = function(req, res, next) {
    const authHeader = req.cookies['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).redirect('/api/users/login')

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).redirect('/api/users/login')
        req.user = user;
        next()
    });
}

exports.generateAccessToken = function(user) {
    return jwt.sign({id: user.id}, process.env.TOKEN_SECRET, { expiresIn: 60*60 });
}
