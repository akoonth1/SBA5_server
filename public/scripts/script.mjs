async function getpokemon() {
    let pokemon_name_for_adding = "";

    async function get_pokemon_description(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let speciesData = await response.json();
            let flavorTextEntry = await speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
            console.log(flavorTextEntry.flavor_text);
            return await flavorTextEntry.flavor_text;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    
    };
        

    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        //console.log(data);
        
    // Create a <select> element
const select = document.createElement('select');
select.id = 'pokemonSelector';

// Populate the <select> element with <option> elements
data.results.forEach((pokemon, index) => {
    console.log(pokemon);
    const option = document.createElement('option');
    option.value = pokemon.name;
    option.textContent = pokemon.name;
    option.dataset.index = index; // Store the index in a data attribute
    select.appendChild(option);
});

// Append the <select> element to the DOM
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>Pokemon</h1>`;
appDiv.appendChild(select);

// Function to load Pokémon data
async function loadPokemonData(url) {
   await fetch(url)
        .then(response => response.json())
        .then(pokemonData => {
            console.log(pokemonData);

            // Clear previous Pokémon data
            const previousPokemon = document.getElementById('pokemonDetails');
            if (previousPokemon) {
                previousPokemon.remove();
            }

            // Create a div to display Pokémon details
            const pokemon = document.createElement('div');
            pokemon.id = 'pokemonDetails';
            pokemon_name_for_adding = pokemonData.name;
            pokemon.innerHTML = `
                <h2>${pokemonData.name}</h2>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p>Height: ${pokemonData.height}</p>
                <p>Weight: ${pokemonData.weight}</p>
                <p>Abilities: ${pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p>Types: ${pokemonData.types.map(type => type.type.name).join(', ')}</p>
                <p>Species: ${pokemonData.species.url}</p>
            
                

            `;

                // <p>Flavor Text: ${get_pokemon_description(pokemonData.species.url)}</p>
                // async error leads to improper render of text --promise is not resolved before the function returns
            appDiv.appendChild(pokemon);
        })
        .catch(error => {
            console.error('Error fetching Pokémon data:', error);
        });
}

// Load the information for the first option in the selector
if (data.results.length > 0) {
    loadPokemonData(data.results[0].url);
}

// Add event listener to log the index of the selected item and fetch data
select.addEventListener('change', (event) => {
    
    const selectedIndex = event.target.selectedIndex;
    console.log('Selected index:', selectedIndex);
    console.log(data.results[selectedIndex].url);

    // Fetch data for the selected Pokémon
    loadPokemonData(data.results[selectedIndex].url);

    
});

document.getElementById("pokemonForm").addEventListener("submit", function(event) {
    //event.preventDefault();
    document.getElementById('pokemonNameInput').value = pokemon_name_for_adding;
    console.log(document.getElementById('pokemonNameInput').value);
    event.target.submit();
    
});

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }






}


 getpokemon();