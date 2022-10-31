const router = require("express").Router();
const { Anime, User, Review } = require("../../models");
const withAuth = require("../../utils/auth");

// get all users
router.get("/", (req, res) => {
  Anime.findAll({
    attributes: ["id", "title", "poster"],
    include: [
      {
        model: Review,
        attributes: [
          "id",
          "review_text",
          "anime_id",
          "anime_rating",
          "user_id",
          "created_at",
        ],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbAnimeData) => res.json(dbAnimeData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Anime.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "poster"],
    include: [
      {
        model: Review,
        attributes: ["id", "review_text", "anime_id", "user_id", "created_at"],
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
      res.json(dbAnimeData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", withAuth, (req, res) => {
  Anime.create({
    id: req.body.anime_id,
    title: req.body.title,
    poster: req.body.poster,
  })
    .then((dbAnimeData) => res.json(dbAnimeData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", withAuth, (req, res) => {
  Anime.update(
    {
      title: req.body.title,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbAnimeData) => {
      if (!dbAnimeData) {
        res.status(404).json({ message: "No movie found with this id" });
        return;
      }
      res.json(dbAnimeData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", withAuth, (req, res) => {
  Anime.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbAnimeData) => {
      if (!dbAnimeData) {
        res.status(404).json({ message: "No movie found with this id" });
        return;
      }
      res.json(dbAnimeData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;