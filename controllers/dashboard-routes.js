const router = require("express").Router();
const { Anime, User, Review } = require("../models");
const withAuth = require("../utils/auth");

// get all reviews
router.get("/", withAuth, (req, res) => {
  Review.findAll({
    where: {
      user_id: req.session.user_id,
    },
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
      res.render("dashboard", { reviews, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/edit/:id", withAuth, (req, res) => {
  Review.findByPk(req.params.id, {
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
  })
    .then((dbReviewData) => {
      if (dbReviewData) {
        const review = dbReviewData.get({ plain: true });
        res.render("edit-post", {
          review,
          loggedIn: true,
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;