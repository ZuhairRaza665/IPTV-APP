import axios from "axios";
import { movies, shows, showsName } from "./api";

export const fetchMovies = async () => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie?api_key=d159eaf1a8e9ef27976592ad48ed5a2a"
    );
    movies.splice(0, movies.length, ...response.data.results); // Replace existing movies with fetched results
    console.log("movies :", movies[1]);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const fetchTV = async () => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/tv?api_key=d159eaf1a8e9ef27976592ad48ed5a2a"
    );
    showsName.splice(0, showsName.length, ...response.data.results); // Replace existing movies with fetched results
    console.log("showsName :", showsName[1]);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};
