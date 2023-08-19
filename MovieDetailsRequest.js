import { movies } from "./api";
import { store } from "./redux/store";
import { addLikedMovies } from "./redux/actions";

export const errorArray = [];

export const fData = async () => {
  console.log("Entering fData");
  const movieLength = movies.length;
  console.log("Movies length: ", movieLength);
  const batchSize = 100; // Number of movies to fetch in each batch
  const batches = Math.ceil(movieLength / batchSize);
  let breakLoop = false;

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    console.log("Batch Index:", batchIndex); // Logging batch index
    const batchStart = batchIndex * batchSize;
    const batchEnd = Math.min((batchIndex + 1) * batchSize, movieLength);

    console.log("Batch Start:", batchStart); // Logging batch start index
    console.log("length 2: ", movieLength);
    console.log("Batch End:", batchEnd); // Logging batch end index

    const fetchPromises = [];

    for (let i = batchStart; i < batchEnd; i++) {
      if (i < movieLength) {
        console.log("Fetching data for movie:", i); // Logging the movie index being fetched
        fetchPromises.push(fetchMovieData(movies[i]));
        console.log("Fetched data for movie:", i); // Logging when data is fetched for the movie
      } else {
        console.log("end");
        breakLoop = true;
        break;
      }
    }

    if (breakLoop) {
      console.log("end 2");
      break;
    }

    await Promise.all(fetchPromises);
  }
};
const fetchMovieData = async (item) => {
  let fullTitle;
  let nam = null;
  let year = null;
  let index = null;

  if (item) {
    fullTitle = item.title;

    index = fullTitle.indexOf(" - ");

    if (index == -1) {
      index = fullTitle.indexOf("(");
      nam = fullTitle.substring(0, index - 2);
      year = fullTitle.substring(index + 1, index + 5);
    } else {
      nam = fullTitle.substring(0, index);
      year = fullTitle.substring(index + 3, index + 7);
    }
  }

  if (nam != null) {
    const modifiedName = nam.replace(/ /g, "%20");

    const API_ENDPOINT = `https://api.themoviedb.org/3/search/movie?query=${modifiedName}&%20US&primary_release_year=${year}&page=1&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;
    try {
      const response = await fetch(API_ENDPOINT);
      const data = await response.json();
      const movieData = data.results[0];
      const movieId = movieData.id || null;

      if (movieId) {
        item.id = movieId;
        const detailsPromise = fetchMovieDetails(item, movieId);
        await detailsPromise;
      }
    } catch (error) {
      errorArray.push(item);
    }
  }
};

const fetchMovieDetails = async (item, movieID) => {
  const API_ENDPOINT = `https://api.themoviedb.org/3/movie/${movieID}?&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;

  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    item.backdrop_path = data.backdrop_path;
    item.genreNames = data.genres.map((genre) => genre.name);
    item.overview = data.overview;
    item.poster_path = data.poster_path;
    item.release_date = data.release_date;
    item.runtime = data.runtime;
  } catch (error) {
    errorArray.push(item);
  }
};

export const getLikedData = async (likedList, dispatch) => {
  const likedItems = store.getState().likedItems;
  console.log("User's liked list in movie details:", likedList);
  console.log("Initial redux in movie details:", likedItems);

  console.log("dispatch from movies: ", dispatch);
  const likedMovies = movies.filter((movie) => likedList.includes(movie.id));
  console.log("Liked movies:", likedMovies[likedMovies.length - 1]);
  dispatch(addLikedMovies(likedMovies));
};
