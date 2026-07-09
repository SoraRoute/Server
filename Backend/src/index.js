const express = require("express");
require("dotenv").config();

const db = require("./db/db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Running");
});

const adminRoutes = require("./routers/AdminRoutes");
const sellerRoutes = require("./routers/SellerRoutes");
const authRoutes  = require("./routers/AuthRoutes");
app.use("/auth",authRoutes)
app.use("/seller", sellerRoutes);
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});