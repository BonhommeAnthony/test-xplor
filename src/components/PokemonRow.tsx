import { Pokemon, PokemonSpecies } from "pokenode-ts";
import { Link } from "react-router-dom";
import usePokeApi from "src/hooks/usePokeApi";

interface PokemonProps {
  pokemon: Pokemon;
}

export default function PokemonRow({ pokemon }: PokemonProps): JSX.Element {
  const { data: species } = usePokeApi((api) => api.utility.getResourceByUrl<PokemonSpecies>(pokemon.species.url));

  return species ? (
    <tr>
      <td width="1">
        <img
          src={pokemon.sprites.other?.["official-artwork"].front_default ?? "src/assets/pokeball.png"}
          alt={`${species.name} official artwork`}
          style={{
            height: "3em",
          }}
        />
      </td>
      <td>
        <Link to={`/pokemon/${species.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          {species.name}
        </Link>
      </td>
      <td>{species.id}</td>
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
      <td></td>
    </tr>
  );
}
