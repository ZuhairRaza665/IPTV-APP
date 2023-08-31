import axios from "axios";
import { movies, shows, showsName } from "./api";
import { store } from "./redux/store";
import { addLikedMovies, addToContinueWatching } from "./redux/actions";

export let errorArray = [];
export let uniqueErrorArray = [];

export const fData = async () => {
  // console.log("starting movie");
  const movieLength = movies.length;
  const batchSize = 100;
  const batches = Math.ceil(movieLength / batchSize);
  let breakLoop = false;

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    // console.log("Batch Index for movies:", batchIndex); // Logging batch index
    const batchStart = batchIndex * batchSize;
    const batchEnd = Math.min((batchIndex + 1) * batchSize, movieLength);

    // console.log("Batch Start for movies:", batchStart); // Logging batch start index
    // console.log("length 2 for movies: ", movieLength);
    // console.log("Batch End for movies:", batchEnd); // Logging batch end index

    const fetchPromises = [];

    for (let i = batchStart; i < batchEnd; i++) {
      if (i < movieLength) {
        // console.log("Fetching data for movie:", i); // Logging the movie index being fetched
        fetchPromises.push(fetchMovieData(movies[i]));
        // console.log("Fetching data for movie:", i); // Logging the movie index being fetched
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
    item.vote_average = data.vote_average;
    item.vote_count = data.vote_count;
  } catch (error) {
    errorArray.push(item);
  }
};

export const getLikedData = async (likedList, dispatch, setRefresh) => {
  // console.log("Liked List from getLikedData: ", likedList);
  // console.log("movie 100 from getLikedData: ", movies[100]);
  // console.log("movie 200 from getLikedData: ", movies[200]);
  // console.log("movie -50 from getLikedData: ", movies[movies.length - 50]);

  const likedMovies = likedList.map((likedTitle) => {
    const foundMovie = movies.find((movie) => movie.title === likedTitle);
    if (foundMovie) {
      return foundMovie;
    } else {
      const foundTv = showsName.find((show) => show.title === likedTitle);
      return foundTv;
    }
  });

  // console.log("Liked Movies from getLikedData: ", likedMovies);

  dispatch(addLikedMovies(likedMovies));
  setRefresh(true);
};

export const getContinueWatchingData = async (
  watchingList,
  dispatch,
  setRefresh
) => {
  console.log("Continue Watching List from getLikedData: ", watchingList);

  const continueWatchingArray = watchingList.map((item) => {
    const foundMovie = movies.find((movie) => movie.title === item.title);
    if (foundMovie) {
      return foundMovie;
    } else {
      const title = item.title;

      const seasonIndex = title.search(/S\d+/i);
      const seasonNumber = title.slice(seasonIndex, seasonIndex + 3);
      console.log("Season Number:", seasonNumber);

      const seasonNumberIndex = title.indexOf(seasonNumber);
      let finalTitle = title.substring(0, seasonNumberIndex - 1);

      console.log("Final Title:", finalTitle);
      console.log("Shows index:", shows[1]);
      const foundTv = showsName.find(
        (show) => show.title.toLowerCase() === finalTitle.toLowerCase()
      );

      const foundShow = shows.find(
        (show) => show.title.toLowerCase() === item.title.toLowerCase()
      );

      if (foundShow) {
        console.log("Found show: ", foundShow);
        foundTv.title = foundShow.title;
        foundTv.link = foundShow.link;
        console.log("Final TV: ", foundTv);
      } else {
        console.log("Not Found show");
      }

      console.log("returing tv: ", foundTv);
      return foundTv;
    }
  });

  console.log("Continue Watchings from getLikedData: ", continueWatchingArray);

  dispatch(addToContinueWatching(continueWatchingArray));
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
    // console.log("Batch Index for tv:", batchIndex); // Logging batch index
    const batchStart = batchIndex * batchSize;
    const batchEnd = Math.min((batchIndex + 1) * batchSize, showsLength);

    // console.log("Batch Start for tv:", batchStart); // Logging batch start index
    // console.log("Batch End for tv:", batchEnd); // Logging batch end index

    const fetchPromises = [];

    for (let i = batchStart; i < batchEnd; i++) {
      if (i < showsLength) {
        // console.log("Fetching data for tvshows:", i); // Logging the movie index being fetched
        fetchPromises.push(fetchShowsDetails(showsName[i]));
        // console.log("Fetching data for tvshows:", i); // Logging the movie index being fetched
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

  const uniqueTitlesMap = new Map();

  // Filter out duplicates based on the title attribute
  errorArray.forEach((item) => {
    const title = item.title;
    if (!uniqueTitlesMap.has(title)) {
      uniqueTitlesMap.set(title, true);
      uniqueErrorArray.push(item);
    }
  });
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
    item.vote_average = result.vote_average;
    item.vote_count = result.vote_count;
    item.number_of_seasons = result.number_of_seasons;
  } catch (error) {
    errorArray.push(item);
  }
};

export const fData3 = async () => {
  // console.log("Entering shows");
  const showsLength = shows.length;
  console.log("Shows length: ", showsLength);
  const batchSize = 300; // Number of movies to fetch in each batch
  const batches = Math.ceil(showsLength / batchSize);
  let breakLoop = false;

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    console.log("Batch Index for shows:", batchIndex); // Logging batch index
    const batchStart = batchIndex * batchSize;
    const batchEnd = Math.min((batchIndex + 1) * batchSize, showsLength);

    console.log("Batch Start for shows:", batchStart); // Logging batch start index
    console.log("Batch End for shows:", batchEnd); // Logging batch end index

    const fetchPromises = [];

    for (let i = batchStart; i < batchEnd; i++) {
      if (i < showsLength) {
        // console.log("Fetching data for tvshows:", i); // Logging the movie index being fetched
        fetchPromises.push(fetchShowsEpisodes(shows[i]));
        // console.log("Fetching data for tvshows:", i); // Logging the movie index being fetched
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

const fetchShowsEpisodes = async (item) => {
  const title = item.title;
  const seasonIndex = title.indexOf("S");
  const season = title.substring(seasonIndex + 1, seasonIndex + 2);
  const episodeIndex = title.indexOf("E");
  const episode = title.substring(episodeIndex + 1, episodeIndex + 2);
  const API_ENDPOINT = `https://api.themoviedb.org/3/tv/${item.id}/season/${season}/${episode}/1?&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;

  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    item.id = data.id;
    item.name = data.name;
    item.still_path = data.still_path;
    item.overview = data.overview;
    item.air_date = data.air_date;
    item.vote_average = data.vote_average;
    item.vote_count = data.vote_count;
    item.runtime = data.runtime;
  } catch (error) {
    errorArray.push(item);
  }
};

export const fetchOneShowsSeason = async (item) => {
  // console.log("Entering fetchOneShowsSeason");
  const API_KEY = "d159eaf1a8e9ef27976592ad48ed5a2a";

  const API_ENDPOINT1 = `https://api.themoviedb.org/3/tv/${item.id}?&api_key=${API_KEY}`;

  let number_of_seasons = null;
  try {
    const response = await fetch(API_ENDPOINT1);
    const data = await response.json();
    number_of_seasons = data.number_of_seasons;
  } catch (error) {
    console.error("Error fetching show information:", error);
    return;
  }

  console.log("total seasons: ", number_of_seasons);

  let seasons = {};

  for (let i = 1; i <= number_of_seasons; i++) {
    seasons[i] = [];
  }

  console.log("seasons array: ", seasons); //season start from 1 and episode staart from 0th index [season][episode]

  const size = Object.keys(seasons).length;
  console.log("Size of seasons object:", size);

  let index = shows.findIndex((show) =>
    show.title.toLowerCase().includes(item.title.toLowerCase())
  );

  for (let a = 1; a <= number_of_seasons; a++) {
    const API_ENDPOINT2 = `https://api.themoviedb.org/3/tv/${item.id}/season/${a}?&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;

    try {
      const response = await fetch(API_ENDPOINT2);
      const data = await response.json();
      const episodesArr = data.episodes;
      seasons[a] = episodesArr; //setting the episode array to season index for example season 1 whole episodes

      console.log("index : ", index);
      for (let i = 0; i < seasons[a].length; i++) {
        //run till season length, setting link of each episode for that whole season
        seasons[a][i].link = shows[index].link;
        seasons[a][i].title = shows[index].title;
        index++;
      }
    } catch (error) {
      console.error("Error fetching episode information:", error);
      errorArray.push(item);
    }
  }
  return seasons;
};
