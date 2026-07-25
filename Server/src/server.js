/**
 * MarketHive Backend - Server Entry Point
 *
 * Boots the Express app (configured in app.js) and starts
 * listening for HTTP requests.
 */

const app = require("./app");

// Port the HTTP server listens on.
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
