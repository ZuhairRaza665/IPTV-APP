import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";

import DropDown, { optionSelected } from "../DropDown";
import { movies, shows, showsName } from "../api";

function ShowsScreen(item) {
  // const [movies, setMovies] = useState([]);
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  const handleOptionSelect = (selectedOption) => {
    // Do something with the selected option
    console.log("Selected option:", selectedOption);
  };

  return (
    <View style={{ flex: 1 }}>
      {movies.length > 0 && ( // Check if movies array has items
        <View style={styles.container1}>
          <View style={{ flex: 0.4 }}>
            <Image
              style={styles.image}
              source={{
                uri: `https://image.tmdb.org/t/p/original/${movies[1].poster_path}`,
              }}
            />
          </View>
          <View style={{ flex: 0.6, padding: 15, top: 40, margin: 5 }}>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Title: </Text>
              <Text style={styles.text2}>{movies[1].original_title}</Text>
            </View>

            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Release: </Text>
              <Text style={styles.text2}>{movies[1].release_date}</Text>
            </View>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Runtime: </Text>
              <Text style={styles.text2}>{movies[1].original_title}</Text>
            </View>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Overview: </Text>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.text2}>{movies[1].overview}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.container2}>
        <DropDown options={options} />
        {optionSelected == 1 && <Text style={styles.text}>hello 1</Text>}
        {optionSelected == 2 && <Text style={styles.text}>hello 2</Text>}
        {optionSelected == 3 && <Text style={styles.text}>hello 3</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 0.4,
    backgroundColor: "#212020",
    flexDirection: "row",
  },
  container2: {
    flex: 0.6,
    backgroundColor: "#0B0B0B",
  },
  image: {
    resizeMode: "contain", // Maintain the aspect ratio while fitting within the container
    height: "100%", // Occupies the full height of its parent
    width: "100%", // Occupies the full width of its parent
  },
  text: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  text2: {
    fontSize: 15,
    color: "white",
  },
  inlineContainer: {
    flexDirection: "row",
    marginBottom: 10, // Add some space between the lines
  },
  overviewTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

export default ShowsScreen;
