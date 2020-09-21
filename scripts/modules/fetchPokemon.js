import speakFunction from './speechApi.js';
export default (function pokemon() {
  const fetchPokemonUrl = async id => await (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json();
  const listOfPokemon = [];

  const fetchDescriptionUrl = async id => await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)).json();
  const descriptions = [];

  const list = document.querySelector('.pokemon-list');

  const fetchPokemon = async () => {

    for (let i = 1; i <= 150; i++) {
      listOfPokemon.push(await fetchPokemonUrl(i));
      descriptions.push(await fetchDescriptionUrl(i));
    }

    const listOfPokemonResolved = await Promise.all(listOfPokemon);

    const listTemplate = listOfPokemonResolved.reduce((accumulator, pokemon) => {
      const types = pokemon.types.map(typeInfo => typeInfo.type.name);

      accumulator += `
        <li class="card ${types[0]}">
          <h3 class="card-title">${pokemon.id}. ${pokemon.name}</h3>
          <img class="card-img" src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" alt="${pokemon.name}" />
          <p class="card-type"><span>${types.join('</span> | <span>')}</span></p>
        </li>
      `
      return accumulator;
    }, '');
    list.innerHTML = listTemplate;

    const listOfDescriptionsResolved = await Promise.all(descriptions);

    const descripTemplate = listOfDescriptionsResolved.reduce((accumulator, description) => {

      accumulator += `
        <p class="card-descrip">${description.flavor_text_entries[3].flavor_text}</p>#
      `
      return accumulator;
    }, '');

    const cardInfo = descripTemplate.split('#');
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {
      if (index <= 149) card.innerHTML += cardInfo[index];
    });
    speakFunction();
  };
  fetchPokemon();
})();