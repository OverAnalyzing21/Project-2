const router = require("express").Router();
const { Review } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", (req, res) => {
  Review.findAll()
    .then((dbReviewData) => res.json(dbReviewData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/user-reviews", (req, res) => {
  Review.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["anime_id"],
  })
    .then((dbReviewData) => {
      const reviews = dbReviewData.map((post) => post.get({ plain: true }));
      res.json(reviews);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", withAuth, (req, res) => {
  Review.create({
    review_text: req.body.review_text,
    user_id: req.session.user_id,
    anime_id: req.body.anime_id,
    anime_rating: req.body.anime_rating,
  })
    .then((dbReviewData) => res.json(dbReviewData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put("/:id", (req, res) => {
  Review.update(
    {
      review_text: req.body.review_text,
      anime_rating: req.body.anime_rating,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbReviewData) => {
      if (!dbReviewData) {
        res.status(404).json({ message: "No comment found with this id" });
        return;
      }
      res.json(dbReviewData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", withAuth, (req, res) => {
  Review.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbReviewData) => {
      if (!dbReviewData) {
        res.status(404).json({ message: "No comment found with this id!" });
        return;
      }
      res.json(dbReviewData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;