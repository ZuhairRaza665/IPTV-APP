import React from "react";
import { connect } from "react-redux";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { addLikedItem, removeLikedItem } from "./redux/actions";

const MovieCard = ({
  navigation,
  bigData,
  direction,
  numOfColmb,
  top,
  likedItems,
  addLikedItem,
  removeLikedItem,
}) => {
  const handleLongPress = (item) => {
    const isItemLiked = likedItems.some(
      (likedItem) => likedItem?.id === item?.id
    );

    if (isItemLiked) {
      removeLikedItem(item);
    } else {
      addLikedItem(item);
    }
  };

  const handleOnPress = () => {
    navigation.navigate("VideoScreen");
  };

  const renderItem = ({ item }) => {
    const isItemLiked = likedItems.some(
      (likedItem) => likedItem?.id === item?.id
    );

    return (
      <TouchableWithoutFeedback
        onLongPress={() => handleLongPress(item)}
        onPress={handleOnPress}
      >
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={{
              uri: `https://image.tmdb.org/t/p/original/${item?.poster_path}`,
            }}
          />
          {isItemLiked && (
            <View style={styles.heartIconContainer}>
              <Icon name="heart" size={20} color="red" />
            </View>
          )}
          <Text style={styles.titleSty}>{item?.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  if (direction === "vertical") {
    return (
      <FlatList
        data={bigData}
        renderItem={renderItem}
        keyExtractor={(item) => item?.title}
        numColumns={numOfColmb}
      />
    );
  }

  return (
    <FlatList
      data={bigData}
      renderItem={renderItem}
      keyExtractor={(item) => item?.title}
      horizontal={true}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 265,
    width: 165,
    backgroundColor: "#212020",
    margin: 15,
    borderRadius: 15,
    top: 10,
  },
  image: {
    height: "80%",
    borderRadius: 5,
  },
  titleSty: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    top: 10,
    fontWeight: "900",
  },
  heartIconContainer: {
    position: "absolute",
    top: 10,
    right: "10%",
  },
});

const mapStateToProps = (state) => {
  return {
    likedItems: state.likedItems,
  };
};

const mapDispatchToProps = {
  addLikedItem,
  removeLikedItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieCard);
