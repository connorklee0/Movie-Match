// Key: b77fdfec
const search = localStorage.getItem("search")
const filter = localStorage.getItem("filter")
const loadText = document.querySelector(".results__load--text")
const loadSpinner = document.querySelector(".results__loading--spinner")
const moviesList = document.querySelector(".movies__list")
const searchBar = document.getElementById('search-bar')
const resultsHeader = document.querySelector('.results__header--search')
const searchInput = document.getElementById('search--input')

// navigation and alert
const navigateHome = () => window.location.href = 'index.html';
const navigateSearch = () => window.location.href = 'movies.html';
const throwAlert = () => alert('Feature not yet implemented');

searchBar.addEventListener('submit', (event) => {
    event.preventDefault();
    
    userSearch = document.getElementById('search--input').value
    localStorage.setItem("search", userSearch);
    renderMovies(userSearch)
})

async function renderMovies(search) {
    const storedSearch = localStorage.getItem('search') || search;
    const storedFilter = localStorage.getItem('filter') || 'DEFAULT';


    if (!storedSearch) {
        loadText.classList.remove("hidden");
    }
    searchInput.value = storedSearch;
    resultsHeader.innerHTML = `<span class="highlight">"${search}"</span>`;
    loadSpinner.classList.remove("hidden");

    try {
        
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
        const sortedMovies = sortMovies(firstSixMovies, storedFilter)
        moviesList.innerHTML = sortedMovies.map(movie => movieHTML(movie)).join("");

    } catch (error) {
        moviesList.innerHTML = `<div class="highlight results__load--text">Failed to load movies. Try again.</div>`;
        loadSpinner.classList.add("hidden");
    }
}

function sortMovies(movies, filter) {
    if (filter === 'LOW_TO_HIGH') {
        return movies.sort((a, b) => {
            const yearA = parseInt(a.Year.match(/\d{4}/)?.[0] || '0');
            const yearB = parseInt(b.Year.match(/\d{4}/)?.[0] || '0');
            return yearA - yearB;
        });
    }
    else if (filter === 'HIGH_TO_LOW') {
        return movies.sort((a, b) => {
            const yearA = parseInt(a.Year.match(/\d{4}/)?.[0] || '0');
            const yearB = parseInt(b.Year.match(/\d{4}/)?.[0] || '0');
            return yearB - yearA;
        });
    }
    else {
        return movies;
    }
}

function filterMovies(event) {
    const filter = event.target.value;
    const storedSearch = localStorage.getItem('search'); // Get fresh search value
    
    localStorage.setItem('filter', filter);
    renderMovies(storedSearch);
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

if (resultsHeader) {
    renderMovies(search)
}
