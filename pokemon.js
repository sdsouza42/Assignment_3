// URL for the Pokémon API
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=5';

// Variables to keep track of the current page and the total number of pages
let currentPage = 1;
let totalPages = 0;

// Function to fetch Pokémon data from the API
function fetchPokemon(page) {
    axios.get(`${apiUrl}&offset=${(page - 1) * 5}`)
        .then(response => {
            totalPages = Math.ceil(response.data.count / 5);
            displayPokemon(response.data.results);
            displayPagination();
        })
        .catch(error => console.error(error));
}

// Function to display Pokémon on the page
function displayPokemon(pokemonList) {
    const pokemonContainer = document.getElementById('pokemon-list');
    pokemonContainer.innerHTML = ''; // Clear existing Pokémon

    pokemonList.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('col-md-4', 'mb-4');

        const card = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${pokemon.name}</h5>
                </div>
            </div>
        `;

        pokemonElement.innerHTML = card;
        pokemonContainer.appendChild(pokemonElement);
    });
}

// Function to display pagination buttons
function displayPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';  // Clear existing pagination buttons

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);
    startPage = Math.max(endPage - 4, 1);

    for (let i = startPage; i <= endPage; i++) {
        const listItem = document.createElement('li');
        listItem.classList.add('page-item');
        if (i === currentPage) {
            listItem.classList.add('active');
        }

        const link = document.createElement('a');
        link.classList.add('page-link');
        link.textContent = i;
        link.addEventListener('click', () => {
            currentPage = i;
            fetchPokemon(currentPage);
        });

        listItem.appendChild(link);
        pagination.appendChild(listItem);
    }
}

// Fetch and display Pokémon when the page loads
fetchPokemon(currentPage);