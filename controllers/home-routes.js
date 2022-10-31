const router = require("express").Router();
const { Anime , User, Review } = require("../models");
const withAuth = require("../utils/auth");

// get all posts for homepage
router.get("/", (req, res) => {
  Anime.findAll({
    attributes: ["poster"],
  })
    .then((dbMovieData) => {
      let movies = dbMovieData.map((movie) => movie.get({ plain: true }));
      const shuffled = movies.sort(() => 0.5 - Math.random());
      movies = shuffled.slice(0, 9);
      res.render("homepage", {
        movies,
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
          "comment_text",
          "movie_id",
          "user_id",
          "movie_rating",
          "created_at",
        ],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbMovieData) => {
      if (!dbMovieData) {
        res.status(404).json({ message: "No movie found with this id" });
        return;
      }
      const movie = dbMovieData.get({ plain: true });

      res.render("single-post", {
        movie,
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
      "comment_text",
      "movie_id",
      "movie_rating",
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
    .then((dbCommentData) => {
      const comments = dbCommentData.map((post) => post.get({ plain: true }));

      res.render("reviews", { comments, loggedIn: true });
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
          "comment_text",
          "movie_id",
          "user_id",
          "movie_rating",
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