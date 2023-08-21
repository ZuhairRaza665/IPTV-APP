import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Switch, Text } from "react-native";
import MovieCard from "../MovieCard";
import { movies, showsName } from "../api";
import SwitchButton from "../SwitchButton";

const generateRandomIndexes = (maxIndex, count) => {
  const indexes = [];
  while (indexes.length < count) {
    const randomIndex = Math.floor(Math.random() * maxIndex);
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }
  return indexes;
};

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [moviesDataCompleted, setMoviesDataCompleted] = useState(false);
  const [showsDataCompleted, setShowsDataCompleted] = useState(false);
  const [randomMoviesResults, setRandomMoviesResults] = useState([]);
  const [randomShowsResults, setRandomShowsResults] = useState([]);

  useEffect(() => {
    console.log("Selected Index:", selectedIndex);
    handleSearch();
  }, [searchText, selectedIndex]);

  const handleSearch = async () => {
    try {
      if (searchText.length === 0) {
        if (selectedIndex === 0) {
          if (!moviesDataCompleted) {
            const randomIndexesMovies = generateRandomIndexes(
              movies.length - 1,
              40
            );
            const randomResultsMovies = randomIndexesMovies.map(
              (index) => movies[index]
            );

            setRandomMoviesResults(randomResultsMovies);
            setSearchResults(randomResultsMovies);
            setMoviesDataCompleted(true);
          } else {
            console.log("where moviesDataCompleted");
            setSearchResults(randomMoviesResults);
          }
        } else {
          if (!showsDataCompleted) {
            const randomIndexesShows = generateRandomIndexes(
              showsName.length - 1,
              40
            );
            const randomResultsShows = randomIndexesShows.map(
              (index) => showsName[index]
            );
            setRandomShowsResults(randomResultsShows);
            setShowsDataCompleted(true);
            setSearchResults(randomResultsShows);
          } else {
            setSearchResults(randomShowsResults);
          }
        }
      } else {
        // Code for filtering based on search text and selectedIndex
        let filteredResults = [];
        if (selectedIndex === 0) {
          filteredResults = movies.filter((result) =>
            result.title.toLowerCase().includes(searchText.toLowerCase())
          );
          console.log("Movies");
        } else {
          filteredResults = showsName.filter((result) =>
            result.title.toLowerCase().includes(searchText.toLowerCase())
          );
          console.log("TV");
        }
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        placeholderTextColor={"white"}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        style={styles.text}
      />

      <SwitchButton setSelectedIndex={setSelectedIndex} />

      <View style={{ marginTop: 20 }}>
        <MovieCard
          navigation={navigation}
          direction="vertical"
          numOfColmb={2}
          bigData={searchResults}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    backgroundColor: "#0B0B0B",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
});

export default SearchScreen;
