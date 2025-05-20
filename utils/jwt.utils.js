const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '0sjs6gf9mk9nwxq22pzn5hvpxmpgtty34tfx8gz17sy6djnm0xuc65bi9rcc';

module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdimin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },
    
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    
    getUserId: function(authorization) {
        let userId = -1;
        const token = module.exports.parseAuthorization(authorization);
        if(token != null) {
            try {
                const jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null) {
                    userId = jwtToken.userId;
                }
            } catch(err) { }
        }
        return userId;
    }
};