import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import MovieCard from "../MovieCard";
import { movies } from "../api";
import { store } from "../redux/store";

const FavoriteScreen = ({ navigation }) => {
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    setLikedItems(store.getState().likedItems);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites</Text>
      <MovieCard
        navigation={navigation} // Pass your navigation here if needed
        direction="vertical"
        numOfColmb={2} // Corrected prop name
        bigData={likedItems}
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
    paddingLeft: "5%",
  },
});

const mapStateToProps = (state) => ({
  likedItems: state.likedItems,
});

export default connect(mapStateToProps)(FavoriteScreen);
