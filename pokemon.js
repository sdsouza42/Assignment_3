// URL for the Pokémon API
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=810';

// Function to fetch Pokémon data from the API
function fetchPokemon() {
    axios.get(apiUrl)
        .then(response => displayPokemon(response.data.results))
        .catch(error => console.error(error));
}

// Function to display Pokémon on the page
function displayPokemon(pokemonList) {
    const pokemonContainer = document.getElementById('pokemon-list');

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

// Fetch and display Pokémon when the page loads
fetchPokemon();
