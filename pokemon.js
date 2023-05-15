// URL for the Pokémon API
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=6';

// Variables to keep track of the current page and the total number of pages
let currentPage = 1;
let totalPages = 0;

// Function to fetch Pokémon data from the API
function fetchPokemon(page) {
    if ((page - 1) * 5 < 810) {  // Only fetch if the current page times the limit per page is less than or equal to 810
        axios.get(`${apiUrl}&offset=${(page - 1) * 5}`)
            .then(response => {
                totalPages = Math.ceil(810 / 5);  // Calculate total pages based on a maximum of 810 Pokémon
                displayPokemon(response.data.results);
                displayPagination();
            })
            .catch(error => console.error(error));
    }
}


// Function to display Pokémon on the page
function displayPokemon(pokemonList) {
    const pokemonContainer = document.getElementById('pokemon-list');
    pokemonContainer.innerHTML = ''; // Clear existing Pokémon

    // Sort the pokemonList array by ID
    pokemonList.sort((a, b) => a.id - b.id).forEach(pokemon => {
        // Fetch the details for each Pokémon
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            .then(response => {
                const pokemonDetails = response.data;

                const pokemonElement = document.createElement('div');
                pokemonElement.classList.add('col-md-4', 'mb-4');

                const card = `
                    <div class="card text-center" data-toggle="modal" data-target="#pokemonModal" data-id="${pokemonDetails.name}">
                        <img src="${pokemonDetails.sprites.front_default}" class="card-img-top pokemon-image" alt="${pokemonDetails.name}">
                        <div class="card-body">
                            <h5 class="card-title">${pokemonDetails.name}</h5>
                            <a href="#" class="btn btn-primary">More</a>
                        </div>
                    </div>
                `;


                pokemonElement.innerHTML = card;
                pokemonContainer.appendChild(pokemonElement);

                // Add click event listener to the card to fetch and display Pokémon details
                pokemonElement.querySelector('.card').addEventListener('click', function() {
                    fetchPokemonDetails(pokemonDetails.name);
                });
            })
            .catch(error => console.error(error));
    });
}

    // Add click event listener to each card to fetch and display Pokémon details
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const pokemonId = this.dataset.id;
            fetchPokemonDetails(pokemonId);
        });
    });

// Function to fetch Pokémon details
function fetchPokemonDetails(pokemonId) {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => {
            displayPokemonDetails(response.data);
        })
        .catch(error => console.error(error));
}

// Function to display Pokémon details in the modal
function displayPokemonDetails(pokemon) {
    const modalTitle = document.getElementById('pokemonModalLabel');
    const modalBody = document.getElementById('pokemonModalBody');

    modalTitle.textContent = pokemon.name;
    modalBody.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
    `;
}

// Function to display pagination
function displayPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);
    startPage = Math.max(endPage - 4, 1);

    // Create "First" page button
    const firstPageElement = document.createElement('li');
    firstPageElement.classList.add('page-item');
    if (currentPage === 1) {
        firstPageElement.classList.add('disabled');
    }

    const firstPageLink = document.createElement('a');
    firstPageLink.classList.add('page-link');
    firstPageLink.textContent = 'I<';
    firstPageLink.href = '#';
    firstPageLink.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = 1;
        fetchPokemon(currentPage);
    });

    firstPageElement.appendChild(firstPageLink);
    pagination.appendChild(firstPageElement);

    for (let i = startPage; i <= endPage; i++) {
        const pageElement = document.createElement('li');
        pageElement.classList.add('page-item');
        if (i === currentPage) {
            pageElement.classList.add('active');
        }

        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.textContent = i;
        pageLink.href = '#';
        pageLink.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = i;
            fetchPokemon(currentPage);
        });

        pageElement.appendChild(pageLink);
        pagination.appendChild(pageElement);
    }

    // Create "Last" page button
    const lastPageElement = document.createElement('li');
    lastPageElement.classList.add('page-item');
    if (currentPage === totalPages) {
        lastPageElement.classList.add('disabled');
    }

    const lastPageLink = document.createElement('a');
    lastPageLink.classList.add('page-link');
    lastPageLink.textContent = '>I';
    lastPageLink.href = '#';
    lastPageLink.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = totalPages;
        fetchPokemon(currentPage);
    });

    lastPageElement.appendChild(lastPageLink);
    pagination.appendChild(lastPageElement);
}

fetchPokemon(currentPage);
