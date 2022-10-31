const router = require("express").Router();
const { Anime , User, Review } = require("../models");
const withAuth = require("../utils/auth");

// get all posts for homepage
router.get("/", (req, res) => {
  Anime.findAll({
    attributes: ["poster"],
  })
    .then((dbAnimeData) => {
      let anime = dbAnimeData.map((anime) => anime.get({ plain: true }));
      const shuffled = anime.sort(() => 0.5 - Math.random());
      animes = shuffled.slice(0, 9);
      res.render("homepage", {
        animes,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get single post
router.get("/anime/:id", withAuth, (req, res) => {
  Anime.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "poster"],
    include: [
      {
        model: Review,
        attributes: [
          "id",
          "review_text",
          "anime_id",
          "user_id",
          "anime_rating",
          "created_at",
        ],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbAnimeData) => {
      if (!dbAnimeData) {
        res.status(404).json({ message: "No movie found with this id" });
        return;
      }
      const anime = dbAnimeData.get({ plain: true });

      res.render("single-post", {
        anime,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/reviews", withAuth, (req, res) => {
  Review.findAll({
    attributes: [
      "id",
      "review_text",
      "anime_id",
      "anime_rating",
      "created_at",
    ],
    include: [
      {
        model: Anime,
        attributes: ["id", "title", "poster"],
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
    order: [["createdAt", "DESC"]],
  })
    .then((dbReviewData) => {
      const reviews = dbReviewData.map((post) => post.get({ plain: true }));

      res.render("reviews", { reviews, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get single user
router.get("/users/:username", withAuth, (req, res) => {
  User.findOne({
    where: {
      username: req.params.username,
    },
    attributes: ["username"],
    include: [
      {
        model: Review,
        attributes: [
          "id",
          "review_text",
          "anime_id",
          "user_id",
          "anime_rating",
          "created_at",
        ],
        order: ["created_at"],
        include: {
          model: Anime,
          attributes: ["title", "poster"],
        },
      },
    ],
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      const user = dbUserData.get({ plain: true });
      res.render("user-page", {
        user,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

module.exports = router;