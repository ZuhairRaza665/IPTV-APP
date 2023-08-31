import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import Swiper from "react-native-swiper";

const screenHeight = Dimensions.get("window").height;

const MovieSlider = ({ moviesData }) => {
  return (
    <View style={styles.sliderContainer}>
      {moviesData && moviesData.length > 0 ? (
        <Swiper autoplay={true} showsPagination={false}>
          {moviesData.map((movie) => (
            <View key={movie}>
              <Image
                style={[styles.image, { height: screenHeight * 0.3 }]}
                source={{
                  uri: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
                }}
              />
              <Text style={styles.title}>{movie.title}</Text>
            </View>
          ))}
        </Swiper>
      ) : (
        <Text>No movies found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: screenHeight * 0.3 + 21,
  },
  image: {
    width: "100%",
    height: screenHeight * 0.3,
    alignSelf: "center",
    alignContent: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "white",
    alignSelf: "center",
  },
});

export default MovieSlider;
