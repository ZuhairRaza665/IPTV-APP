import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import MovieCard from "../MovieCard";
import { movies } from "../api";

const FavoriteScreen = ({ likedItems }) => {
  // const combinedArray = useMemo(() => {
  //   return likedItems[0].map((id) => {
  //     const movieInfo = movies.find((info) => info.id === id);
  //     return movieInfo;
  //   });
  // }, [likedItems]);

  // useEffect(() => {
  //   console.log("Liked from inside favorite  : ", likedItems[0]);
  //   // Any other side effects related to likedItems can be placed here
  // }, [likedItems]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites</Text>
      <MovieCard
        navigation={null} // Pass your navigation here if needed
        direction="vertical"
        numOfColmb={2} // Corrected prop name
        bigData={likedItems[0]}
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
