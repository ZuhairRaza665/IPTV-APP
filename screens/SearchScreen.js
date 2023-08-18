import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Switch, Text } from "react-native";
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

      setSearchResults(filteredResults);
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
      <MovieCard
        navigation={navigation}
        direction="vertical"
        numOfColmb={2}
        bigData={searchResults}
      />
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
