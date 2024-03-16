const jwt = require("jsonwebtoken")

module.exports = {
    verificaToken(req, res, next) {
        let jwtFromRequest = req.get('Authorization');
        if (jwtFromRequest) {
            let token = jwtFromRequest.split(' ');

            if (token[0] === 'Bearer') {
                jwt.verify(token[1], process.env.KEY_SECRET, (err, resp) => {
                    if (err) {
                        res.status(401).json({
                            status: 'unauthorized',
                            message: 'Sesion caducada, por favor vuelva a ingresar',
                            details: err
                        });
                    } else {
                        req.user = resp.user;
                        next();
                    }
                });
            } else {
                res.status(401).json({
                    status: 'unauthorized',
                    message: 'El token enviado debe ser tipo Bearer Token',
                });
            }
        } else {
            res.status(401).json({
                status: 'unauthorized',
                message: 'No se ha enviado un token para acceder'
            });
        }
    },
}