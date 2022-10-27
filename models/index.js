const User = require("./User");
const Review = require("./Review");
const Anime = require("./Anime");

User.hasMany(Review, {
  foreignKey: "user_id",
});

Anime.hasMany(Review, {
  foreignKey: "anime_id",
});

Review.belongsTo(User, {
  foreignKey: "user_id",
});

Review.belongsTo(Anime, {
  foreignKey: "anime_id",
});

Anime.hasOne(Review);

module.exports = { User, Review, Anime };