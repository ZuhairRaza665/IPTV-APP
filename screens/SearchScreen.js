import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Switch,
  Text,
  ScrollView,
} from "react-native";
import MovieCard from "../MovieCard";
import { movies, showsName } from "../api";
import SwitchButton from "../SwitchButton";

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    handleSearch();
  }, [searchText, selectedIndex]);

  function generateRandomIndexes(maxIndex, count) {
    const indexes = [];
    while (indexes.length < count) {
      const randomIndex = Math.floor(Math.random() * maxIndex);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  }

  const handleSearch = async () => {
    try {
      let filteredResults = [];

      if (selectedIndex == 0) {
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

      const randomIndexes = generateRandomIndexes(filteredResults.length, 40);
      const randomResults = randomIndexes.map(
        (index) => filteredResults[index]
      );
      setSearchResults(
        searchText.length > 0 ? filteredResults : randomResults.slice(0, 40)
      );
    } catch (error) {
      console.error("Error fetching data 3:", error);
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
      <ScrollView style={{ top: 21 }}>
        <MovieCard
          navigation={navigation}
          direction="vertical"
          numOfColmb={2}
          bigData={searchResults}
        />
        <Text style={{ fontSize: 40 }}>dgdg</Text>
      </ScrollView>
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
