import MovieSlider from "../MovieSlider";
import MovieCard from "../MovieCard";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { movies, showsName } from "../api";
import { store } from "../redux/store";

const HomeScreen = ({ navigation }) => {
  const [random, setRandomMovie] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [continueWatching, setContinueWatching] = useState([1, 2, 3]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    const getRandomIndexes = (length, count) => {
      const indexes = [];
      while (indexes.length < count) {
        const randomIndex = Math.floor(Math.random() * length);
        if (
          movies[randomIndex].backdrop_path &&
          !indexes.includes(randomIndex)
        ) {
          indexes.push(randomIndex);
        }
      }
      return indexes;
    };

    const randomIndexesForMovies = getRandomIndexes(movies.length, 15);
    const randomIndexesForShows = getRandomIndexes(showsName.length, 15);
    const randomMovies = randomIndexesForMovies.map((index) => movies[index]);
    const randomShows = randomIndexesForShows.map((index) => showsName[index]);
    const mergedArray = shuffleArray(randomMovies.concat(randomShows));

    setRandomMovie(mergedArray);
    setLikedItems(store.getState().likedItems);
  }, []);

  return continueWatching.length > 0 ? (
    <ScrollView style={styles.container}>
      <View>
        <MovieSlider moviesData={random} />
      </View>

      <Text
        style={{ color: "white", fontSize: 30, fontWeight: "bold", top: 55 }}
      >
        Continue Watching
      </Text>
      <View style={{ marginTop: 45, paddingLeft: 10 }}>
        <MovieCard navigation={navigation} direction={null} bigData={random} />
      </View>
      <View style={{ top: 7 }}>
        <Text
          style={{ color: "white", fontSize: 30, fontWeight: "bold", top: 40 }}
        >
          Explore
        </Text>
      </View>
      <View style={{ marginTop: 35, paddingLeft: 10 }}>
        <MovieCard navigation={navigation} direction={null} bigData={random} />
      </View>
      <View style={{ marginTop: 80 }}></View>
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <View>
        <MovieSlider moviesData={random} />
      </View>
      <Text
        style={{ color: "white", fontSize: 30, fontWeight: "bold", top: 60 }}
      >
        Explore
      </Text>
      <View style={{ top: 50 }}>
        <MovieCard navigation={navigation} direction={null} bigData={random} />
      </View>
      <View style={{ marginTop: 80 }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    paddingTop: "10%",
  },
  text: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default HomeScreen;
