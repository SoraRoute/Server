class CookieHelper {
    // Authors: Nishtha & Pinki

    // Set the authentication cookie after successful login.
    setAuthCookie(res, token) {
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: isProduction,          // true on Render, false locally
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
    }

    // Clear the authentication cookie during logout.
    clearAuthCookie(res) {
        const isProduction = process.env.NODE_ENV === "production";

        res.clearCookie("access_token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });
    }
}

module.exports = new CookieHelper();
