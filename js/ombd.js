const API_KEY = "d97508e6";
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;
const IMG_URL = `http://img.omdbapi.com/?apikey=${API_KEY}`;

const elForm = document.querySelector("[data-movies-form]");
const elList = document.querySelector("[data-movies-list]");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(elForm);
  const name = formData.get("name");
  searchMovies(name);
});

async function searchMovies(query) {
  elList.innerHTML = "<li>Loading...</li>";
  const res = await fetch(`${API_URL}&s=${query}`);
  const searchResult = await res.json();

  renderMovies(searchResult.Search);
}



function renderMovies(movies) {
  elList.innerHTML = "";
  let html = "";
  movies.forEach((movie) => {
    html += `<li><img width="50" src="${movie.Poster}" alt="${movie.Title}" />${movie.Title}</li>`;
  });

  elList.innerHTML = html;
}
