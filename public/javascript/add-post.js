const movieList = document.querySelector("#movielist");
let currentMovie = {};
const sessionUser = document
  .querySelector("#userName")
  .getAttribute("data-username");

async function newFormHandler(event) {
  event.preventDefault();

  const movie_id = currentMovie.movie_id;

  await fetch(`/api/comments/user-comments`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const previousComments = result.filter(
        (movie) => movie.movie_id === movie_id
      );
      if (previousComments.length === 0) {
        postMovie();
      } else {
        alert("You've already reviewed that movie!");
      }
    });
}

async function postMovie() {
  const movie_id = currentMovie.movie_id;
  const title = currentMovie.title;
  const poster = currentMovie.poster;
  const comment_text = document.querySelector(
    'textarea[name="post-text"]'
  ).value;
  const movie_rating = document
    .querySelector(".rating")
    .querySelectorAll(".fas").length;

  const movieResponse = await fetch(`/api/movie/${movie_id}`, {
    method: "GET",
  });
  // check to see if the movie is in the database first
  if (!movieResponse.ok) {
    // if not, add it
    const postNewMovie = await fetch(`/api/movie`, {
      method: "POST",
      body: JSON.stringify({
        movie_id,
        title,
        poster,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const comment = await fetch(`/api/comments`, {
    method: "POST",
    body: JSON.stringify({
      comment_text,
      movie_id,
      movie_rating,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (comment.ok) {
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector(".new-post-form")
  .addEventListener("submit", newFormHandler);

document.addEventListener("click", function (e) {
  if (e.target && e.target.className == "movieChoice") {
    // get the title
    const title =
      e.target.parentElement.parentElement.childNodes[1].textContent;
    document.querySelector("#movieReviewLabel").innerText = title;
    // get the movie id
    const movie_id =
      e.target.parentElement.parentElement.getAttribute("data-id");
    document
      .querySelector("#movieReviewLabel")
      .setAttribute("data-id", movie_id);
    // get the poster source
    const posterLength =
      e.target.parentElement.parentElement.getAttribute("style").length;
    const poster = e.target.parentElement.parentElement
      .getAttribute("style")
      .substr(23, posterLength - 25);
    document.querySelector("#movie-poster").setAttribute("src", poster);

    currentMovie = { title: title, movie_id: movie_id, poster: poster };
  }
});