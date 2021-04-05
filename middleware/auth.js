const OktaJwtVerifier = require('@okta/jwt-verifier')


module.exports = async(req, res, next) => {
    try {
        console.log("varifier called");
        const oktaJwtVerifier = new OktaJwtVerifier({
            issuer: process.env.ISSUER,
        });
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(403).json({
                status: 403,
                message: 'FORBIDDEN',
                error: 'You must send an Authorization header'
            });
        }

        const [authType, token] = authorization.split(' ')
        if (authType !== 'Bearer') {
            return res.status(403).json({
                status: 403,
                message: 'FORBIDDEN',
                error: 'Expected a Bearer token'
            });
        }

        let jwt = await oktaJwtVerifier.verifyAccessToken(token,process.env.AUDIANCE);
        req.jwt = jwt;
        console.log("jwt value",jwt);
        next();
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: 'UNAUTHORIZED',
            error: error.message
        })
    }
}