const jwt = require("jsonwebtoken");

class JwtProvider {

    createJwt(payload) {

        return jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "24h"
            }
        );

    }

    getEmailFromJwt(token) {

        try {

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            return decoded.email;

        } catch (err) {

            throw new Error("Invalid Token");

        }

    }

    verifyJwt(token) {

        try {

            jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            return true;

        } catch (err) {

            throw new Error("Invalid Token");

        }

    }

}

module.exports = new JwtProvider();