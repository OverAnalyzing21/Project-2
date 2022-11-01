const tryAgain = document.querySelector("#try-again");
function animeSearch() {
  event.preventDefault();

  const longLoad = setTimeout(() => {
    tryAgain.innerHTML = `<a href="/dashboard">hmmm...this is taking longer than expected.  Click here to refresh page if you are impatient</a>`;
  }, 5000);

  tryAgain.innerHTML = `<div class="spinner-border text-light" style="width: 3rem; height: 3rem;" role="status">
  <span class="visually-hidden">Loading...</span>
</div></div>`;
  // mal get request
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: {
		'X-RapidAPI-Key': '4eec39b591msh4d59b594451f352p12a26bjsnfa2ade41ea9b',
	  'X-RapidAPI-Host': 'myanimelist.p.rapidapi.com'
	}
  };

  
  const searchOption = document.querySelector("#anime-search").value;
  // search bar value set to nothing
  document.querySelector("#anime-search").value = "";
  // if there is something in the search bar, fetch request
  if (searchOption) {
    fetch(
      `https://myanimelist.p.rapidapi.com/anime/${searchOption}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        showAnimes(result);
        clearTimeout(longLoad);
      })
      .catch((error) => {
        console.log("error", error);
        tryAgain.innerHTML = "";
      });
  } else {
    alert("Please enter search information");
    tryAgain.innerHTML = "";
  }
}

function showAnimes(animes) {
  const animeList = document.querySelector("#animeList");
  // if anime has child elements, remove them for the next search
  while (animeList.firstChild) {
    animeList.removeChild(animeList.firstChild);
  }
  //  for loop for top 5 movies of the search
  let temp = "";
  for (let i = 0; i < 5; i++) {
    temp += `<div class="userCard" data-id=${
      animes.results[i].id
    } style="background-image: url('${animes.results[i].image}')">
      <h3 class="title anime-name">${
        animes.results[i].title
      }</h3><div class="inner-text">${animes.results[i].description.substr(
      0,
      6
    )}</div>
      <div class="bottom-button"><button type="button" data-bs-toggle="modal" data-bs-target="#movieReview" class="animeChoice">Choose This One</button></div>
    </div>`;
  }

  animeList.innerHTML = temp;

  tryAgain.innerHTML = `<a href="/dashboard">Didn't see what you were looking for? Try to get more specific. We aren't mind readers.</a>`;
}

document.querySelector("#searchAnime").addEventListener("click", animeSearch);