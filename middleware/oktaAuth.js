const OktaJwtVerifier = require('@okta/jwt-verifier');


const oktaJwtVerifier = new OktaJwtVerifier({
    clientId: process.env.TEST_CLIENT_ID,
    issuer: process.env.ISSUER,
    assertClaims: process.env.ASSERTCLAIMS,
    testing: process.env.TESTING
  });

  module.exports=async(req,res,next)=>{
    console.log('inside new verifier>>>>>>>>>>>>>');
    const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];
  const audience = process.env.AUDIANCE;
  return oktaJwtVerifier.verifyAccessToken(accessToken, audience)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
  }

