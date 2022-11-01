const animeList = document.querySelector("#animelist");
const averageRatingBox = document.querySelector(".average-rate");

function getAverage() {
  const averageRatingToHalf =
    Math.round(
      (document.querySelectorAll(".fas").length /
        document.querySelectorAll(".reviews").length) *
        2
    ) / 2;
  const averageRating = Math.floor(averageRatingToHalf);
  ratingHTML = "";
  for (let i = 0; i < averageRating; i++) {
    ratingHTML += `<i class="fa-solid fa-star"></i>`;
  }

  if (averageRatingToHalf !== averageRating) {
    ratingHTML += `<i class="fa-solid fa-star-half-stroke"></i>`;
    for (let i = 5 - averageRating; i > 1; i--) {
      ratingHTML += `<i class="fa-regular fa-star"></i>`;
    }
  } else {
    for (let i = 5 - averageRating; i > 0; i--) {
      ratingHTML += `<i class="fa-regular fa-star"></i>`;
    }
  }

  averageRatingBox.innerHTML = `Average Rating: ${averageRatingToHalf}/5 ${ratingHTML}`;
}

let currentAnime = {};
async function newFormHandler(event) {
  event.preventDefault();

  const anime_id = currentAnime.anime_id;

  await fetch(`/api/reviews/user-reviews`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const previousReviews = result.filter(
        (anime) => anime.anime_id === anime_id
      );
      if (previousReviews.length === 0) {
        postAnime();
      } else {
        alert("You've already reviewed that movie!");
      }
    });
}

async function postAnime() {
  const anime_id = currentAnime.anime_id;
  const title = currentAnime.title;
  const poster = currentAnime.poster;
  const review_text = document.querySelector(
    'textarea[name="post-text"]'
  ).value;
  const anime_rating = document
    .querySelector(".rating")
    .querySelectorAll(".fas").length;

  const animeResponse = await fetch(`/api/anime/${anime_id}`, {
    method: "GET",
  });
  // check to see if the movie is in the database first
  if (!animeResponse.ok) {
    // if not, add it
    const postNewAnime = await fetch(`/api/anime`, {
      method: "POST",
      body: JSON.stringify({
        anime_id,
        title,
        poster,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const review = await fetch(`/api/reviews`, {
    method: "POST",
    body: JSON.stringify({
      review_text,
      anime_id,
      anime_rating,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (review.ok) {
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector(".new-post-form")
  .addEventListener("submit", newFormHandler);

document.querySelector(".animeChoice").addEventListener("click", function (e) {
  const title = document.querySelector("#currentAnimeTitle").textContent;
  const poster = document
    .querySelector("#currentAnimePoster")
    .getAttribute("src");
  const anime_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];
  document.querySelector("#animeReviewLabel").innerText = title;
  document.querySelector("#anime-poster").setAttribute("src", poster);
  currentMovie = { title: title, anime_id: anime_id, poster: poster };
});

getAverage();