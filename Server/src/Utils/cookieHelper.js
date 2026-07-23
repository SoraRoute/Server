class CookieHelper {
    // Authors: Nishtha & Pinki

    // Set the authentication cookie after successful login.
    setAuthCookie(res, token) {
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
    }

    // Clear the authentication cookie during logout.
    clearAuthCookie(res) {
        res.clearCookie("access_token");
    }
}

module.exports = new CookieHelper();