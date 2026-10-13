import { useEffect, useState } from 'react';
import './PokemonCard.css';

const TYPES_FR = {
  normal: 'Normal', fire: 'Feu', water: 'Eau', electric: 'Électrik',
  grass: 'Plante', ice: 'Glace', fighting: 'Combat', poison: 'Poison',
  ground: 'Sol', flying: 'Vol', psychic: 'Psy', bug: 'Insecte',
  rock: 'Roche', ghost: 'Spectre', dragon: 'Dragon', dark: 'Ténèbres',
  steel: 'Acier', fairy: 'Fée',
};

const TOTAL_POKEMON = 1025;

export default function PokemonCard() {
  const [id, setId] = useState(94);
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((r) => r.json()),
    ])
      .then(([data, species]) => {
        if (ignore) return;
        const frName = species.names.find((n) => n.language.name === 'fr');
        setPokemon({
          name: frName ? frName.name : data.name,
          types: data.types.map((t) => TYPES_FR[t.type.name] ?? t.type.name),
        });
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [id]);

  const next = () => setId((current) => (current >= TOTAL_POKEMON ? 1 : current + 1));
  const previous = () => setId((current) => (current <= 1 ? TOTAL_POKEMON : current - 1));
  const number = String(id).padStart(3, '0');

  return (
    <div className="pokedex">
      <div className="pokedex__top">
        <div className="pokedex__lens" aria-hidden="true" />
        <span className="pokedex__dot pokedex__dot--red" aria-hidden="true" />
        <span className="pokedex__dot pokedex__dot--yellow" aria-hidden="true" />
        <span className="pokedex__dot pokedex__dot--green" aria-hidden="true" />
      </div>

      <div className="pokedex__body">
        <figure className="pokedex__screen">
          <img
            key={id}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            alt={pokemon ? pokemon.name : 'Chargement…'}
          />
          <figcaption>
            <span className="pokedex__number">N°{number}</span>
            <span className="pokedex__name">{pokemon ? pokemon.name : '…'}</span>
          </figcaption>
        </figure>

        <div className="pokedex__controls">
          <div className="pokedex__buttons">
            <button className="pokedex__button" onClick={previous} aria-label="Pokémon précédent">◀</button>
            <button className="pokedex__button" onClick={next} aria-label="Pokémon suivant">▶</button>
          </div>
          <ul className="pokedex__types">
            {pokemon && pokemon.types.map((type) => <li key={type}>{type}</li>)}
          </ul>
          <div className="pokedex__dpad" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
