import { useDebounce } from "@uidotdev/usehooks";
import { Pokemon } from "pokenode-ts";
import { useState } from "react";
import usePokeApi, { resolveResources } from "src/hooks/usePokeApi";
import PokemonRow from "./PokemonRow";

export default function PokemonList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedItems, setLoadedItems] = useState(20);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: pokemon,
    isLoading,
    isFetching,
    error,
  } = usePokeApi(
    async (api) => {
      const offset = 0;
      if (!debouncedSearchTerm) {
        const list = await api.pokemon.listPokemons(offset, loadedItems);
        return resolveResources<Pokemon>(list);
      } else {
        try {
          const pokemon = await api.pokemon.getPokemonByName(debouncedSearchTerm.toLowerCase());
          return { results: [pokemon], count: 1 };
        } catch (error) {
          throw new Error("Failed to fetch Pokémon");
        }
      }
    },
    { keepPreviousData: true },
    [loadedItems, debouncedSearchTerm]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLoadMore = () => setLoadedItems(loadedItems + 20);
  const shouldShowLoadMoreButton = pokemon && pokemon.results.length < pokemon.count;

  return (
    <>
      <input
        className="search-input"
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error instanceof Error ? error.message : "Unknown error"}</div>}{" "}
      {pokemon && (
        <table border={1} className="pokemon-table">
          <tbody>
            {pokemon.results.map((p) => (
              <PokemonRow key={p.id} pokemon={p} />
            ))}
          </tbody>
        </table>
      )}
      <div>
        {shouldShowLoadMoreButton && (
          <button className="load-more-button" onClick={handleLoadMore}>
            {isFetching ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </>
  );
}
