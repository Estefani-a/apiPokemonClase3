const pokemonListEl = document.getElementById("pokemon-list");
const favoritesEl = document.getElementById("favorites");
const searchInput = document.getElementById("search");

let favorites = [];

// 1. Conectarse a la API y mostrar lista
async function getPokemons(limit = 20, offset = 0) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();

  pokemonListEl.innerHTML = ""; // limpio lista antes de renderizar

  for (const poke of data.results) {
    const pokeRes = await fetch(poke.url);
    const pokeData = await pokeRes.json();

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${pokeData.name}</span>
      <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
      <button onclick="addFavorite('${pokeData.name}', '${pokeData.sprites.front_default}')">⭐</button>
    `;
    pokemonListEl.appendChild(li);
  }
}

// 2. Agregar a favoritos
function addFavorite(name, img) {
  if (!favorites.find(p => p.name === name)) {
    favorites.push({ name, img });
    renderFavorites();
  }
}

// 3. Eliminar de favoritos
function removeFavorite(name) {
  favorites = favorites.filter(p => p.name !== name);
  renderFavorites();
}

// 4. Mostrar favoritos
function renderFavorites() {
  favoritesEl.innerHTML = "";
  favorites.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${p.name}</span>
      <img src="${p.img}" alt="${p.name}">
      <button onclick="removeFavorite('${p.name}')">❌</button>
    `;
    favoritesEl.appendChild(li);
  });
}

// 5. Buscador
searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.toLowerCase();
  if (query.length > 2) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (!res.ok) {
        pokemonListEl.innerHTML = "<li>No encontrado</li>";
        return;
      }
      const pokeData = await res.json();
      pokemonListEl.innerHTML = `
        <li>
          <span>${pokeData.name}</span>
          <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
          <button onclick="addFavorite('${pokeData.name}', '${pokeData.sprites.front_default}')">⭐</button>
        </li>
      `;
    } catch (err) {
      console.error(err);
    }
  } else {
    getPokemons(); // si borro el texto, vuelvo a mostrar lista normal
  }
});

// Inicial
getPokemons();
