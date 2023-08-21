import MovieSlider from "../MovieSlider";
import MovieCard from "../MovieCard";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { movies } from "../api";
import { store } from "../redux/store";

const HomeScreen = ({ navigation }) => {
  const [random, setRandomMovie] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [continueWatching, setContinueWatching] = useState([1, 2, 3]);

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

    const randomIndexes = getRandomIndexes(movies.length, 30);
    const randomMovies = randomIndexes.map((index) => movies[index]);
    setRandomMovie(randomMovies.slice(0, 30));
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
