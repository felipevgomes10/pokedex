import speakFunction from './speechApi.js';
export default (function filterByName() {
  const getPokemonUrl = async id => await (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json();
  const listOfPokemon = [];

  const getDescription = async id => await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)).json();
  let description = {};

  const form = document.querySelector('.form');
  const form2 = document.querySelector('.form2');
  const list = document.querySelector('.pokemon-list');

  const filter = async () => {
    for (let i = 1; i <= 150; i++) {
      listOfPokemon.push(await getPokemonUrl(i));
    }
    const listOfPokemonResolved = await Promise.all(listOfPokemon);

    const filterFunction = async () => {
      if (form2[0].value) {
        form[0].value = "";
        description = {};
        const nameValue = form2[0].value.toLowerCase();

        const foundPokemon = listOfPokemonResolved.find(pokemon => pokemon.name === nameValue);

        if (foundPokemon) {
          const types = foundPokemon.types.map(typeInfo => typeInfo.type.name);

          description = await getDescription(foundPokemon.id);

          const htmlTemplate = `
            <li class="card ${types[0]}">
              <h3 class="card-title">${foundPokemon.id}. ${foundPokemon.name}</h3>
              <img class="card-img" src="https://pokeres.bastionbot.org/images/pokemon/${foundPokemon.id}.png" alt="${foundPokemon.name}" />
              <p class="card-type"><span>${types.join('</span> | <span>')}</span></p>
              <p class="card-descrip">
                  ${description.flavor_text_entries[3].flavor_text}
                </p>
            </li>
          `

          list.innerHTML = htmlTemplate;

          speakFunction();
        } else {
          const htmlTemplate = `
            <li class="no-result">
              <p>No pokemon was found :(</p>
            </li>
          `
          list.innerHTML = htmlTemplate;
        }
      }
    }

    function pressEnter(event) {
      event.preventDefault();
      if (event.key === "Enter")
        filterFunction();
    };

    form2[1].addEventListener('click', filterFunction);
    window.addEventListener('keydown', pressEnter);
  };
  filter();
})();