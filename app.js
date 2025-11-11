// Key: b77fdfec
const search = localStorage.getItem("search")
const loadText = document.querySelector(".results__load--text")
const loadSpinner = document.querySelector(".results__loading--spinner")
const moviesList = document.querySelector(".movies__list")
const searchBar = document.getElementById('search-bar')
const resultsHeader = document.querySelector('.results__header--search')
const searchInput = document.getElementById('search--input')

searchBar.addEventListener('submit', (event) => {
    event.preventDefault();
    
    userSearch = document.getElementById('search--input').value
    localStorage.setItem("search", userSearch);
    renderMovies(userSearch)
})

async function renderMovies(search) {
    if (!search) {
        loadText.classList.remove("hidden");
    }
    searchInput.value = search;
    resultsHeader.innerHTML = `<span class="highlight">"${search}"</span>`;

    try {
        loadSpinner.classList.remove("hidden");
        const response = await fetch(`http://www.omdbapi.com/?apikey=b77fdfec&s=${search}`);
        const moviesData = await response.json();

        if (moviesData.Response === 'False') {
            moviesList.innerHTML = `<div class="highlight results__load--text">${moviesData.Error} Try again.</div>`;
            return;
        }

        // Hide loading states and show results
        loadSpinner.classList.add("hidden");
        loadText.classList.add("hidden");

        const firstSixMovies = moviesData.Search.slice(0, 6);
        moviesList.innerHTML = firstSixMovies.map(movie => movieHTML(movie)).join("");

    } catch (error) {
        moviesList.innerHTML = `<div class="highlight results__load--text">Failed to load movies. Try again.</div>`;
        loadSpinner.classList.add("hidden");
    }
}

function movieHTML(movie) {
    return `<div class="movie">
                <figure class="movie__img--wrapper">
                    <img class="movie__img" src="${movie.Poster}" draggable="false">
                </figure>
                <h3 class="movie__title">
                    <span class="content">${movie.Title}</span>
                </h3>
                <h4 class="movie__year highlight">
                     Year: <span class="content">${movie.Year}</span>
                </h4>
            </div>`
}

function navigateHome() {
    window.location.href = `${window.location.origin}/index.html`
}

function navigateSearch() {
    window.location.href = `${window.location.origin}/movies.html`
}

function throwAlert() {
    alert('Feature has not been implemented')
}

renderMovies(search)
