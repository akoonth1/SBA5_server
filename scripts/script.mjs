async function getpokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Call the function to fetch the data
getpokemon();