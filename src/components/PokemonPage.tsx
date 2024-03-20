import { Link, useParams } from "react-router-dom";
import usePokeApi from "../hooks/usePokeApi";

function PokemonDetails() {
  const { id } = useParams();
  const pokemonId = parseInt(id as string);
  const { data: pokemon, status } = usePokeApi((api) => api.pokemon.getPokemonById(pokemonId));

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error" || !pokemon) return <div>Error loading Pokémon details.</div>;

  return (
    <div>
      <div className="pokemon-header">
        <h2 className="pokemon-name">
          {pokemon.name} (ID: {pokemon.id})
        </h2>
        <div>
          <img
            className="pokemon-sprite"
            src={pokemon.sprites.other?.["official-artwork"].front_default ?? "src/assets/pokeball.png"}
            alt={`${pokemon.name} sprite`}
          />
          <ul className="pokemon-types">
            {pokemon.types.map((type, index) => (
              <li key={index}>{type.type.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pokemon-info">
        <div>Base Experience: {pokemon.base_experience}</div>
        <div>Height: {pokemon.height} dm</div>
        <div>Weight: {pokemon.weight} hg</div>
      </div>
      <div className="pokemon-abilities">
        <h3>Abilities:</h3>
        <ul>
          {pokemon.abilities.map((ability, index) => (
            <li key={index}>{ability.ability.name}</li>
          ))}
        </ul>
      </div>
      <div className="pokemon-stats">
        <h3>Stats:</h3>
        <ul>
          {pokemon.stats.map((stat, index) => (
            <li key={index}>
              {stat.stat.name}: {stat.base_stat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PokemonPage() {
  return (
    <div className="pokemon-details">
      <Link to="/" className="back-link">
        Back to list
      </Link>
      <PokemonDetails />
    </div>
  );
}
