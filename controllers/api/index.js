const router = require("express").Router();

const userRoutes = require("./user-routes.js");
const animeRoutes = require("./anime-routes");
const reviewRoutes = require("./review-routes");


router.use("/users", userRoutes);
router.use("/anime", animeRoutes);
router.use("/review", reviewRoutes);

module.exports = router;