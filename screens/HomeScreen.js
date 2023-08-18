import MovieSlider from "../MovieSlider";
import MovieCard from "../MovieCard";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { movies } from "../api";

const HomeScreen = ({ navigation }) => {
  const [random, setRandomMovie] = useState([]);

  useEffect(() => {
    function getRandomIndexes(length, count) {
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
    }

    const randomIndexes = getRandomIndexes(movies.length, 30);
    const randomMovies = randomIndexes.map((index) => movies[index]);
    setRandomMovie(randomMovies.slice(0, 30));
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View>
        <MovieSlider moviesData={random} />
        <Text style={styles.text}>Continue Watching</Text>
      </View>
      <View style={{ top: "4%" }}>
        <MovieCard navigation={navigation} direction={null} bigData={null} />
      </View>
      <View style={{ top: "7%" }}>
        <Text style={styles.text}>Explore</Text>
      </View>
      <View style={{ marginTop: "18%" }}>
        <MovieCard navigation={navigation} direction={null} bigData={random} />
      </View>
      <Text> </Text>
      <Text> </Text>
      <Text> </Text>
    </ScrollView>
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
    top: "17%",
  },
});

export default HomeScreen;
