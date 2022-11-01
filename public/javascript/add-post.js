const animeList = document.querySelector("#animelist");
let currentAnime = {};
const sessionUser = document
  .querySelector("#userName")
  .getAttribute("data-username");

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
    const anime_id = await fetch(`/api/anime`, {
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

document.addEventListener("click", function (e) {
  if (e.target && e.target.className == "animeChoice") {
    // get the title
    const title =
      e.target.parentElement.parentElement.childNodes[1].textContent;
    document.querySelector("#animeReviewLabel").innerText = title;
    // get the anime id
    const anime_id =
      e.target.parentElement.parentElement.getAttribute("data-id");
    document
      .querySelector("#animeReviewLabel")
      .setAttribute("data-id", anime_id);
    // get the poster source
    const posterLength =
      e.target.parentElement.parentElement.getAttribute("style").length;
    const poster = e.target.parentElement.parentElement
      .getAttribute("style")
      .substr(23, posterLength - 25);
    document.querySelector("#anime-poster").setAttribute("src", poster);

    currentAnime = { title: title, anime_id: anime_id, poster: poster };
  }
});