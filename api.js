import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as FileSystem from "expo-file-system";
// import db from "./SQLiteHelper";

// Define data storage arrays
export const tv = [];
export const movies = [];
export const shows = [];
export const showsName = [];

// // Function to store large data
// const storeLargeData = async (data, key) => {
//   try {
//     await db.transaction(async (tx) => {
//       // Create table if it doesn't exist
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS ${key} (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT);`
//       );

//       // Insert data into the table
//       for (const item of data) {
//         const serializedItem = JSON.stringify(item);
//         tx.executeSql(`INSERT INTO ${key} (data) VALUES (?);`, [serializedItem]);
//       }
//     });

//     console.log(`Data (${key}) stored successfully.`);
//   } catch (error) {
//     console.error(`Error storing ${key} data:`, error);
//   }
// };

// // Function to retrieve large data
// const retrieveLargeData = async (key) => {
//   try {
//     const result = await new Promise((resolve, reject) => {
//       db.transaction((tx) => {
//         tx.executeSql(
//           `SELECT data FROM ${key};`,
//           [],
//           (_, { rows }) => {
//             const data = rows._array.map((item) => JSON.parse(item.data));
//             resolve(data);
//           },
//           (_, error) => reject(error)
//         );
//       });
//     });

//     console.log(`Data (${key}) retrieval completed.`);
//     return result;
//   } catch (error) {
//     console.error(`Error retrieving ${key} data:`, error);
//     return [];
//   }
// };

// Function to fetch and process data
export const fetchData = async (link) => {
  try {
    // let channelData = [];
    // let retrievedMovies = await retrieveLargeData("movies");
    // let retrievedTV = await retrieveLargeData("tv");
    // let retrievedShows = await retrieveLargeData("shows");
    // let retrievedShowsName = await retrieveLargeData("showsName");

    // if (retrievedMovies.length > 0 || retrievedTV.length > 0 || retrievedShows.length > 0 || retrievedShowsName.length > 0) {
    //   console.log("Fetching data from local storage of IPTV");

    //   // Process and batch data
    //   const batchSize = 1000;
    //   const processBatch = (sourceArray, targetArray) => {
    //     for (let i = 0; i < sourceArray.length; i += batchSize) {
    //       const batch = sourceArray.slice(i, i + batchSize);
    //       targetArray.push(...batch);
    //     }
    //   };

    //   processBatch(retrievedMovies, movies);
    //   processBatch(retrievedTV, tv);
    //   processBatch(retrievedShows, shows);
    //   processBatch(retrievedShowsName, showsName);

    // } else {
      console.log("Fetching data from IPTV API");

      try {
        const response = await axios.get(link);
        const data = response.data;

        const lines = data.split("\n");
        let currentIndex = 0;

        while (currentIndex < lines.length) {
          if (lines[currentIndex].startsWith("#EXTINF:-1,")) {
            const title = lines[currentIndex].substring(10).trim().substring(1);
            const link = lines[currentIndex + 1].trim();
            const overview = null;
            const poster = null;
            const year = null;

            channelData.push({ title, link, overview, poster, year });
          }

          currentIndex++;
        }

        for (const item of channelData) {
          const link = item.link.toLowerCase();

          if (!/\.(mp4|mkv|avi|srt|mpg|webg|mp2|mpeg|mpe|ogg|m4p|m4v|wmv|mov|qt|flv|swf|avchd)$/.test(link)) {
            tv.push(item);
          } else if (/\bE[0-9]\b/.test(item.title)) {
            shows.push(item);
          } else {
            movies.push(item);
          }
        }

        const addedTitles = new Set();

        for (const show of shows) {
          let bol = false;
          let name = show.title;

          if (name.includes("Game of Thrones S01 E01")) {
            bol = true;
          }

          name = name.substring(0, name.indexOf("S0"));

          if (!addedTitles.has(name)) {
            if (bol) {
              console.log("Name is: ", name);
            }

            addedTitles.add(name);
            showsName.push({ title: name });
          }
        }

        // Store data in local storage
        await storeLargeData(movies, "movies");
        await storeLargeData(tv, "tv");
        await storeLargeData(shows, "shows");
        await storeLargeData(showsName, "showsName");
      } catch (error) {
        console.error("Error fetching data from API:", error);
        return [];
      }
    // }

    return channelData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
