const API_KEY = "d97508e6";
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;
const IMG_URL = `http://img.omdbapi.com/?apikey=${API_KEY}`;

const elForm = document.querySelector("[data-movies-form]");
const elList = document.querySelector("[data-movies-list]");
const elModal = document.querySelector("[data-modal]");
const elDiv = document.querySelector("[data-movie-about]");
const elPagination = document.querySelector("[data-movie-pagination]");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(elForm);
  const name = formData.get("name");
  const year = formData.get("year");
  const type = formData.get("type");
  searchMovies(name, year, type);
});

async function searchMovies(query, year, type, page = 1) {
  elList.innerHTML = "<li>Loading...</li>";
  const res = await fetch(
    `${API_URL}&s=${query}&y=${year}$type=${type}$page=${page}`
  );
  const searchResult = await res.json();

  if (searchResult.Error) {
    alert(searchResult.Error);
    return;
  }
  renderMovies(searchResult.Search);
  renderPagination(
    Math.ceil(+searchResult.totalResults / 10),
    query,
    year,
    type,
    page
  );
}

async function getMovie(movieId) {
  const res = await fetch(`${API_URL}&i=${movieId}`);

  return await res.json();
}

function renderMovies(movies) {
  elList.innerHTML = "";
  let html = "";
  movies.forEach((movie) => {
    const moviePosterUrl =
      movie.Poster === "N/A"
        ? "https://via.placeholder.com/180x250"
        : movie.Poster;
    html += `      <div class="card-box">
    <img class="img-card" widht="180" height="300" src=${moviePosterUrl} alt=${movie.Title} />
    <li class="mb-1">${movie.Title}</li>
    <button class="btn btn-danger  mb-2" data-info-btn="#test-modal" data-movie-id=${movie.imdbID}>Info</button>
  </div>`;
  });
  // movies.forEach((movie) => {
  //   html += `<li data-modal-open="#test-modal" class="list"><img width="170" height="300" src="${movie.Poster}" alt="${movie.Title}" /><h3>${movie.Title}</h3> </li>`;
  // });

  elList.innerHTML = html;
}

function renderPagination(totalPages, query, page) {
  elPagination.innerHTML = "";
  let html = "";

  html += ` <li class="page-item${+page === 1 ? " disabled" : ""} ">
  <a class="page-link"data-movie-page=${
    +page - 1
  } data-movie-query=${query} href="?page=${
    +page - 1
  } tabindex="-1">Previous</a>
</li>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item${
      +page === i ? " active" : ""
    }"><a class="page-link" data-movie-page=${i} data-movie-query=${query} href="?page=${i}">${i}</a></li>`;
  }

  html += `<li class="page-item${+page === totalPages ? " disabled" : ""}">
  <a class="page-link"data-movie-page=${
    +page + 1
  } data-movie-query=${query} href="?page=${+page + 1} tabindex="1" >Next</a>
</li>`;

  elPagination.innerHTML = html;
}

document.addEventListener("click", (evt) => {
  onModalBtnClick(evt);
  onModalOutsideClick(evt);
  onModalCloseClick(evt);
  onPageClick(evt);
});

function onModalBtnClick(evt) {
  const el = evt.target.closest("[data-info-btn]");

  if (!el) return;

  const modalSel = el.dataset.infoBtn;
  const movieId = el.dataset.movieId;
  const elModal = document.querySelector(modalSel);

  filModal(movieId);

  elModal.classList.add("show");
}

function onModalOutsideClick(evt) {
  const el = evt.target;

  if (!el) return;

  el.closest("[data-modal]").classList.remove("show");
}

function onModalCloseClick(evt) {
  const el = evt.target.closest("[data-modal-close]");

  if (!el) return;

  el.parentElement.parentElement.classList.remove("show");
}

function onPageClick(evt) {
  const el = evt.target.closest("[data-modal-page]");

  if (!el) return;

  evt.preventDefault();

  searchMovies(el.dataset.movieQuery, el.dataset.moviePage);
}

async function filModal(movieId) {
  try {
    const movie = await getMovie(movieId);

    elDiv.querySelector("[data-title]").textContent = `Name: ${movie.Title}`;
    elDiv.querySelector("[data-year]").textContent = `Year: ${movie.Year}`;
    elDiv.querySelector("[data-rated]").textContent = `Rated: ${movie.Rated}`;
    elDiv.querySelector(
      "[data-released]"
    ).textContent = `Released: ${movie.Released}`;
    elDiv.querySelector(
      "[data-runtime]"
    ).textContent = `Runtime: ${movie.Runtime}`;
    elDiv.querySelector("[data-genre]").textContent = `Genre: ${movie.Genre}`;
    elDiv.querySelector(
      "[data-director]"
    ).textContent = `Director: ${movie.Director}`;
    elDiv.querySelector(
      "[data-metascore]"
    ).textContent = `Metascore: ${movie.Metascore}`;
    elDiv.querySelector(
      "[data-imdbrating]"
    ).textContent = `imdbrating: ${movie.imdbrating}`;
    elDiv.querySelector("[data-type]").textContent = `Type: ${movie.Type}`;
    elDiv.querySelector("[data-id]").textContent = `imdbID: ${movie.imdbID}`;
  } catch (error) {
    alert(error);
  }
}
