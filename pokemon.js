// URL for the Pokémon API
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=6';

// Variables to keep track of the current page, the total number of pages, and the filtered Pokémon
let currentPage = 1;
let totalPages = 0;
let filteredPokemon = [];
let currentFilters = [];

// Function to fetch Pokémon data from the API
function fetchPokemon(page) {
    if ((page - 1) * 6 < 810) {  // Only fetch if the current page times the limit per page is less than or equal to 810
        axios.get(`${apiUrl}&offset=${(page - 1) * 6}`)
            .then(response => {
                totalPages = Math.ceil(810 / 6);  // Calculate total pages based on a maximum of 810 Pokémon
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
// Function to display Pokémon details in the modal
function displayPokemonDetails(pokemon) {
    const modalTitle = document.getElementById('pokemonModalLabel');
    const modalBody = document.getElementById('pokemonModalBody');

    modalTitle.innerHTML = `
        <h2>${pokemon.name.toUpperCase()}</h2>
        <h5>${pokemon.id}</h5>
    `;

    modalBody.innerHTML = `
        <div style="width:200px">
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}"/>
            <div>
                <h3>Abilities</h3>
                <ul>
                    ${pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
                </ul>
            </div>
            <div>
                <h3>Stats</h3>
                <ul>
                    ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                </ul>
            </div>
        </div>
        <h3>Types</h3>
        <ul>
            ${pokemon.types.map(type => `<li>${type.type.name}</li>`).join('')}
        </ul>
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


// Function to fetch Pokémon types from the API
function fetchPokemonTypes() {
    axios.get('https://pokeapi.co/api/v2/type/')
        .then(response => {
            displayPokemonTypes(response.data.results);
        })
        .catch(error => console.error(error));
}

fetchPokemonTypes();

// Function to display Pokémon types as checkboxes
function displayPokemonTypes(types) {
    currentFilters = types;
    const typesContainer = document.getElementById('pokemon-types');
    typesContainer.innerHTML = ''; // Clear existing types

    types.forEach((type, index) => {
        const typeElement = document.createElement('div');
        typeElement.classList.add('form-check');

        const checkbox = `
            <input class="form-check-input" type="checkbox" value="${index + 1}" id="${type.name}">
            <label class="form-check-label" for="${type.name}">
                ${type.name}
            </label>
        `;

        typeElement.innerHTML = checkbox;
        typesContainer.appendChild(typeElement);
    });

    // Add event listener to checkboxes
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const selectedTypes = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.id);
        });
    });

// Add event listener to "Apply Filter" button
const applyFilterButton = document.getElementById('apply-filter');
applyFilterButton.addEventListener('click', function() {
    currentPage = 1;  // Reset the current page
    const selectedTypes = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    currentFilters = selectedTypes;
    fetchPokemonByType(selectedTypes);
});
}

// Function to fetch Pokémon by type
function fetchPokemonByType(types) {
    currentFilters = types;
    const promises = types.map(type => axios.get(`https://pokeapi.co/api/v2/type/${type}/`));
    Promise.all(promises)
        .then(responses => {
            // Get the Pokémon for each type
            const pokemonByType = responses.map(response => response.data.pokemon.map(p => p.pokemon.name));

            // Find the Pokémon that are common to all types
            const commonPokemon = pokemonByType.reduce((a, b) => a.filter(c => b.includes(c)));

            // Fetch the details for each common Pokémon
            const detailPromises = commonPokemon.map(pokemon => axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`));
            Promise.all(detailPromises)
                .then(responses => {
                    filteredPokemon = responses.map(response => response.data);
                    totalPages = Math.ceil(filteredPokemon.length / 6);
                    displayPaginatedPokemon();
                    displayPagination();
                })
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
}

// Function to display paginated Pokémon
function displayPaginatedPokemon() {
    const paginatedPokemon = filteredPokemon.slice((currentPage - 1) * 6, currentPage * 6);
    displayPokemon(paginatedPokemon);
}