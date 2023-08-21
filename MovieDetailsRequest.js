import axios from "axios";
import { movies, showsName } from "./api";
import { store } from "./redux/store";
import { addLikedMovies } from "./redux/actions";

export const errorArray = [];

export const fData = async () => {
  console.log("starting movie");
  const movieLength = movies.length;
  const batchSize = 100;
  const batches = Math.ceil(movieLength / batchSize);
  let breakLoop = false;

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    const batchStart = batchIndex * batchSize;
    const batchEnd = Math.min((batchIndex + 1) * batchSize, movieLength);

    const fetchPromises = [];

    for (let i = batchStart; i < batchEnd; i++) {
      if (i < movieLength) {
        fetchPromises.push(fetchMovieData(movies[i]));
      } else {
        console.log("end movie");
        breakLoop = true;
        break;
      }
    }

    if (breakLoop) {
      console.log("end movie");
      break;
    }

    await Promise.all(fetchPromises.map((promise) => promise.catch((e) => e)));
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
      const response = await axios.get(API_ENDPOINT);
      const data = response.data;
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
    const response = await axios.get(API_ENDPOINT);
    const data = response.data;
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

export const getLikedData = async (likedList, dispatch, setRefresh) => {
  console.log("Liked List from getLikedData: ", likedList);
  console.log("movie 100  from getLikedData: ", movies[100].id);
  console.log("movie 200  from getLikedData: ", movies[200].id);
  console.log("movie 200  from getLikedData: ", movies[movies.length - 50].id);
  console.log(
    "does like list items included in movie: ",
    movies.filter((movie) => likedList.includes(movie.id))
  );
  const likedMovies = movies.filter((movie) => likedList.includes(movie.id));
  console.log("Liked Movies from getLikedData: ", likedMovies);
  dispatch(addLikedMovies(likedMovies));
  setRefresh(true);
};

export const fData2 = async () => {
  console.log("Entering shows");
  const showsLength = showsName.length;
  console.log("Shows length: ", showsLength);
  const batchSize = 100; // Number of movies to fetch in each batch
  const batches = Math.ceil(showsLength / batchSize);
  let breakLoop = false;

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    const batchStart = batchIndex * batchSize;
    const batchEnd = Math.min((batchIndex + 1) * batchSize, showsLength);

    const fetchPromises = [];

    for (let i = batchStart; i < batchEnd; i++) {
      if (i < showsLength) {
        fetchPromises.push(fetchShowsDetails(showsName[i]));
      } else {
        console.log("end shows");
        breakLoop = true;
        break;
      }
    }

    if (breakLoop) {
      console.log("end shows");
      break;
    }

    await Promise.all(fetchPromises);
  }
};
const fetchShowsDetails = async (item) => {
  const title = item.title;
  const modifiedName = title.replace(/ /g, "%20");
  const API_ENDPOINT = `https://api.themoviedb.org/3/search/tv?query=${modifiedName}&page=1&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;

  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    const result = data.results[0];
    item.id = result.id;
    item.title = result.name;
    item.backdrop_path = result.backdrop_path;
    item.genreNames = result.genre_ids;
    item.overview = result.overview;
    item.poster_path = result.poster_path;
    item.release_date = result.first_air_date;
  } catch (error) {
    errorArray.push(item);
  }
};
