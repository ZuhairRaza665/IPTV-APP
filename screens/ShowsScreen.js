import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";

import DropDown, { optionSelected } from "../DropDown";
import { showsName } from "../api";

const screenWidth = Dimensions.get("window").width;

function ShowsScreen({ route }) {
  const { item } = route.params;
  const [selectedOption, setSelectedOption] = useState(1);
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  const handleOptionSelect = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <View style={{ flex: 0.7 }}>
        <View style={{ flex: 0.6, flexDirection: "row" }}>
          <View style={{ flex: 0.5, paddingLeft: 10 }}>
            <Image
              style={styles.image}
              source={{
                uri: `https://image.tmdb.org/t/p/original/${item?.poster_path}`,
              }}
            />
          </View>
          <View style={{ flex: 0.5, top: 55, left: 10 }}>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Title: </Text>
              <Text style={[styles.text2]}>{item?.title}</Text>
            </View>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Release: </Text>
              <Text style={styles.text2}>{item?.release_date}</Text>
            </View>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Genre: </Text>
              <Text style={styles.text2}>
                {item?.genreNames.slice(0, 2).join(", ")}
              </Text>
              <Text style={styles.text2}></Text>
            </View>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Rating: </Text>
              <Text style={styles.text2}>
                {item?.vote_average + "(" + item?.vote_count + ")"}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 0.4 }}>
          <View style={styles.inlineContainer}>
            <Text
              style={{
                fontSize: 15,
                color: "white",
                fontWeight: "bold",
                top: 60,
              }}
            >
              Overivew:
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "white",
                top: 60,
              }}
            >
              {"    " + item?.overview.slice(0, screenWidth - 340)}
            </Text>
          </View>
          <Text style={styles.text3}>
            {item?.overview.slice(screenWidth - 340)}
          </Text>
        </View>
      </View>
      <View style={{ top: 30 }}>
        <DropDown options={options} onOptionSelect={handleOptionSelect} />
        {selectedOption == 1 && <Text style={styles.text}>hello 1</Text>}
        {selectedOption == 2 && <Text style={styles.text}>hello 2</Text>}
        {selectedOption == 3 && <Text style={styles.text}>hello 3</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    top: 50,
    resizeMode: "contain",
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
    maxWidth: screenWidth - 260,
  },
  text3: {
    fontSize: 15,
    color: "white",
    top: 30,
    left: 1,
  },
  inlineContainer: {
    flexDirection: "row",
    marginBottom: 30, // Add some space between the lines
  },
});

export default ShowsScreen;
