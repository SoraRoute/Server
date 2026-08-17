/**
 * MarketHive Backend - Server Entry Point
 *
 * Boots the Express app (configured in app.js) and starts
 * listening for HTTP requests.
 */

const app = require("./app");
require("dotenv").config();

// Port the HTTP server listens on.
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
