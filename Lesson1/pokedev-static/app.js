const typeColors = {
    "rock":     [182, 158,  49],
    "ghost":    [112,  85, 155],
    "steel":    [183, 185, 208],
    "water":    [100, 147, 235],
    "grass":    [116, 203,  72],
    "psychic":  [251,  85, 132],
    "ice":      [154, 214, 223],
    "dark":     [117,  87,  76],
    "fairy":    [230, 158, 172],
    "normal":   [170, 166, 127],
    "fighting": [193,  34,  57],
    "flying":   [168, 145, 236],
    "poison":   [164,  62, 158],
    "ground":   [222, 193, 107],
    "bug":      [167, 183,  35],
    "fire":     [245, 125,  49],
    "electric": [249, 207,  48],
    "dragon":   [112,  55, 255]
}

const getPokemon = addEventListener("keypress", async (event) => 
    {
        if (event.key === 'Enter') {
            try {
                let pokemon = document.getElementById("search").value.trim().toLowerCase();
                const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`
                const res = await axios.get(url)
                // console.log(res); // show data chính của 1 pokemon
                const urlAbility = res.data.abilities[0].ability.url
                const resAbility = await axios.get(urlAbility)
                // console.log(resAbility) // show data phần thông tin "ability" của 1 pokemon đó
                const mainColor = typeColors[res.data.types[0].type.name];
                const baseStats = document.querySelector('#base-stats');
                const pokedex = document.querySelector('#pokedex');
                baseStats.style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
                pokedex.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
                document.getElementById("id").innerHTML = `
                    <span>#${res.data.id}</span>
                `
                document.getElementById("poke-image-placeholder").innerHTML = `
                    <img src="${res.data.sprites.other.home.front_default}" id="pokemon-image" alt="pokemon-image" />
                `
                document.getElementById("info").innerHTML = `
                    <span style="background-color: rgb(116, 203, 72);" class="type">
                        Name: ${res.data.name}
                    </span>
                    <span style="background-color: rgb(164,  62, 158);" class="type">
                        Type: ${res.data.types[0].type.name}
                    </span>   
                    <span style="background-color: rgb(45, 51, 107);" class="type">
                        Height: 0.${res.data.height}m
                    </span> 
                    <span style="background-color: rgb(243, 228, 62);" class="type">
                        Weight: ${Math.round(res.data.weight / 4.3)}lbs
                    </span>      
                `
                document.getElementById("ability").innerHTML = `
                    <p>${resAbility.data.effect_entries[1].short_effect}</p>
                `
            } catch (e) {
                alert("Not found!")
                console.log(e)
            }
        }
    }
);