import { useDebounce } from "@uidotdev/usehooks";
import { Pokemon } from "pokenode-ts";
import { useState } from "react";
import usePokeApi, { resolveResources } from "src/hooks/usePokeApi";
import PokemonRow from "./PokemonRow";

export default function PokemonList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: pokemon,
    isLoading,
    error,
  } = usePokeApi(
    async (api) => {
      if (!searchTerm) {
        const offset = currentPage * itemsPerPage;
        const list = await api.pokemon.listPokemons(offset, itemsPerPage);
        return resolveResources<Pokemon>(list);
      } else {
        try {
          const pokemon = await api.pokemon.getPokemonByName(searchTerm.toLowerCase());
          return { results: [pokemon], count: 1 };
        } catch (error) {
          throw new Error("Failed to fetch Pokémon");
        }
      }
    },
    {},
    [currentPage, debouncedSearchTerm]
  );

  const goToNextPage = () => setCurrentPage(currentPage + 1);
  const goToPreviousPage = () => setCurrentPage(currentPage - 1);

  return (
    <>
      <input
        style={{ marginBottom: "1rem" }}
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error instanceof Error ? error.message : "Unknown error"}</div>}
      {pokemon && (
        <table border={1} style={{ background: "white", color: "blue", width: 800 }}>
          <tbody>
            {pokemon.results.map((p) => (
              <PokemonRow key={p.id} pokemon={p} />
            ))}
          </tbody>
        </table>
      )}
      <div>
        {currentPage > 0 && <button onClick={goToPreviousPage}>Previous</button>}
        <button
          onClick={goToNextPage}
          style={{
            marginLeft: "1rem",
          }}
        >
          Next
        </button>
      </div>
    </>
  );
}
