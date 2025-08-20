const pokemonListEl = document.getElementById("pokemon-list");
const favoritesEl = document.getElementById("favorites");
const searchInput = document.getElementById("search");

let favorites = [];

// 🔹 Renderizar lista de pokémon
async function getPokemons(limit = 10, offset = 0) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await res.json();

    pokemonListEl.innerHTML = ""; // limpio lista antes de renderizar

    for (const poke of data.results) {
      const pokeRes = await fetch(poke.url);
      const pokeData = await pokeRes.json();

      const isFavorite = favorites.find(p => p.name === pokeData.name);

      const li = document.createElement("li");
      li.innerHTML = `
        <span>${pokeData.name}</span>
        <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
        <button onclick="toggleFavorite('${pokeData.name}', '${pokeData.sprites.front_default}')">
          ${isFavorite ? "⭐" : "☆"}
        </button>
      `;
      pokemonListEl.appendChild(li);
    }
  } catch (err) {
    console.error("Error al traer pokémon:", err);
  }
}

// 🔹 Alternar favoritos
function toggleFavorite(name, img) {
  const exists = favorites.find(p => p.name === name);
  if (exists) {
    favorites = favorites.filter(p => p.name !== name);
  } else {
    favorites.push({ name, img });
  }
  renderFavorites();
  getPokemons(); // refresco lista para actualizar estrellas
}

// 🔹 Renderizar favoritos
function renderFavorites() {
  favoritesEl.innerHTML = "";
  favorites.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${p.name}</span>
      <img src="${p.img}" alt="${p.name}">
      <button onclick="toggleFavorite('${p.name}', '${p.img}')">❌</button>
    `;
    favoritesEl.appendChild(li);
  });
}

// 🔹 Buscador
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
      const isFavorite = favorites.find(p => p.name === pokeData.name);

      pokemonListEl.innerHTML = `
        <li>
          <span>${pokeData.name}</span>
          <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
          <button onclick="toggleFavorite('${pokeData.name}', '${pokeData.sprites.front_default}')">
            ${isFavorite ? "⭐" : "☆"}
          </button>
        </li>
      `;
    } catch (err) {
      console.error(err);
    }
  } else {
    getPokemons(); // si borro el texto, vuelvo a mostrar lista normal
  }
});

// 🔹 Inicial
getPokemons();
