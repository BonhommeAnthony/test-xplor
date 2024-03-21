import { Pokemon, PokemonSpecies } from "pokenode-ts";
import { Link } from "react-router-dom";
import usePokeApi, { getLocalizedName } from "src/hooks/usePokeApi";

interface PokemonProps {
  pokemon: Pokemon;
}

export default function PokemonRow({ pokemon }: PokemonProps): JSX.Element {
  const { data: species } = usePokeApi((api) => api.utility.getResourceByUrl<PokemonSpecies>(pokemon.species.url));

  const pokedexNumber = species?.pokedex_numbers.find((pokedex) => pokedex.pokedex.name === "national")?.entry_number;

  return species ? (
    <tr>
      <td width="1">{pokedexNumber}</td>
      <td width="1">
        <img
          src={pokemon.sprites.other?.["official-artwork"].front_default ?? "src/assets/pokeball.png"}
          alt={`${species.name} official artwork`}
          style={{
            height: "6em",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "0.5em",
          }}
        >
          {pokemon.types.map((type) => (
            <span
              style={{
                padding: "0.25em 0.5em",
                borderRadius: "0.5em",
                backgroundColor: "#f0f0f0",
                color: "#333",
                fontSize: "0.75em",
              }}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </td>
      <td>
        <Link to={`/pokemon/${species.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          {getLocalizedName(species)}
        </Link>
      </td>
    </tr>
  ) : (
    <tr>
      <td width="1">
        <img
          src={"src/assets/pokeball.png"}
          style={{
            height: "3em",
          }}
        />
      </td>
    </tr>
  );
}
