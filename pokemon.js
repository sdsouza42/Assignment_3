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
        const pokemonElement = document.createElement('p');
        pokemonElement.textContent = pokemon.name;
        pokemonContainer.appendChild(pokemonElement);
    });
}

// Fetch and display Pokémon when the page loads
fetchPokemon();
