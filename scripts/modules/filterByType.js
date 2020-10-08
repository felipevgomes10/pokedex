import speakFunction from './speechApi.js';
export default (function filterByType() {
  const getPokemonUrl = async id => await (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json();
  const listOfPokemon = [];

  const getDescription = async id => await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)).json();
  let descriptions = [];

  const form = document.querySelector('.form');
  const form2 = document.querySelector('.form2');
  const list = document.querySelector('.pokemon-list');

  const filterPokemon = async () => {

    for (let i = 1; i <= 150; i++) {
      listOfPokemon.push(getPokemonUrl(i));
    }
    const listOfPokemonResolvedOrRejected = await Promise.allSettled(listOfPokemon);
    const listOfPokemonFulfilled = listOfPokemonResolvedOrRejected.filter((pokemon) => pokemon.status === 'fulfilled');
    const listOfPokemonResolved = listOfPokemonFulfilled.map((pokemon) => pokemon.value);

    const filterFunction = async () => {
      if (form[0].value) {
        form2[0].value = "";
        descriptions = [];
        const typeValue = form[0].value;

        const filteredList = listOfPokemonResolved.filter(pokemon => {
          let result;
          if (pokemon.types.length > 1) {
            result = (typeValue === pokemon.types[0].type.name) || (typeValue === pokemon.types[1].type.name);
          } else {
            result = (typeValue === pokemon.types[0].type.name);
          }

          return result;
        });

        const htmlFilter = filteredList.reduce((accumulator, pokemon) => {
          descriptions.push(getDescription(pokemon.id));

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
        list.innerHTML = htmlFilter;

        const descriptionsResolved = await Promise.all(descriptions);

        const descriptionsFilter = descriptionsResolved.reduce((accumulator, description) => {

          accumulator += `
            <p class="card-descrip">${description.flavor_text_entries[21].flavor_text}</p>#
          `

          return accumulator;
        }, '');

        const cardsInfo = descriptionsFilter.split('#');
        const cards = document.querySelectorAll(".card");

        cards.forEach((card, index) => card.innerHTML += cardsInfo[index]);

        speakFunction();
      };
    };

    const pressEnter = event => {
      if (event.key === "Enter") {
        event.preventDefault();
        filterFunction();
      }
    }

    form[1].addEventListener('click', filterFunction);
    window.addEventListener('keydown', pressEnter);
  };
  filterPokemon();
})();