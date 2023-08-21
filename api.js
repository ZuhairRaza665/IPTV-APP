import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const tv = [];
export const movies = [];
export const shows = [];
export const showsName = [];

export const fetchData = async (link) => {
  let firstIndexOfMovie = -1;
  let lastIndexOfMovie = -1;
  try {
    const storedData = await AsyncStorage.getItem("cachedData");
    let channelData = [];

    if (storedData) {
      console.log("Fetcing data from local storage of iptv");
      channelData = JSON.parse(storedData);
    } else {
      try {
        console.log("Fetching data from iptv api");
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

            channelData.push({
              title,
              link,
              overview,
              poster,
              year,
            });
          }

          currentIndex++;
        }
      } catch (error) {
        // console.error("error fetching data ");
        return []; // Exit the function here if there's an error
      }
    }

    for (let i = 0; i < channelData.length; i++) {
      const link = channelData[i].link.toLowerCase();

      if (
        !link.includes(".mp4") &&
        !link.includes(".mkv") &&
        !link.includes(".avi") &&
        !link.includes(".srt") &&
        !link.includes(".mpg") &&
        !link.includes(".webg") &&
        !link.includes(".mp2") &&
        !link.includes(".mpeg") &&
        !link.includes(".mpe") &&
        !link.includes(".ogg") &&
        !link.includes(".m4p") &&
        !link.includes(".m4v") &&
        !link.includes(".wmv") &&
        !link.includes(".mov") &&
        !link.includes(".qt") &&
        !link.includes(".flv") &&
        !link.includes(".swf") &&
        !link.includes(".avchd")
      ) {
        tv.push(channelData[i]);
      } else if (
        channelData[i].title.includes("E0") ||
        channelData[i].title.includes("E1") ||
        channelData[i].title.includes("E2") ||
        channelData[i].title.includes("E3") ||
        channelData[i].title.includes("E4") ||
        channelData[i].title.includes("E5") ||
        channelData[i].title.includes("E6") ||
        channelData[i].title.includes("E7") ||
        channelData[i].title.includes("E8") ||
        channelData[i].title.includes("E9")
      ) {
        shows.push(channelData[i]);
      } else {
        movies.push(channelData[i]);

        lastIndexOfMovie = i;
        if (firstIndexOfMovie == -1) {
          firstIndexOfMovie = i;
        }
      }
    }

    const addedTitles = new Set();

    for (let i = 0; i < shows.length; i++) {
      const nam = shows[i].title;
      const titleWithoutSeason = nam.replace(/\s?[sS]\d+.*$|\s?[sS]\d+$/, "");

      if (!addedTitles.has(titleWithoutSeason)) {
        addedTitles.add(titleWithoutSeason);
        showsName.push({
          title: titleWithoutSeason,
        });
      }
    }

    await AsyncStorage.setItem("cachedData", JSON.stringify(channelData));

    return channelData;
  } catch (error) {
    console.error("Error fetching data 1:", error);
    return [];
  }
};
