// actions.js

import { updateUserLikedArray } from "../updateUserLikedArray";

export const ADD_LIKED_ITEM = "ADD_LIKED_ITEM";
export const REMOVE_LIKED_ITEM = "REMOVE_LIKED_ITEM";
export const ADD_LIKED_MOVIES = "ADD_LIKED_MOVIES";

export const addLikedItem = (item) => {
  if (item.id != null) {
    console.log("item being liked: ", item.id);
    updateUserLikedArray(item.id, "add");
  }
  return {
    type: ADD_LIKED_ITEM,
    payload: item,
  };
};

export const removeLikedItem = (item) => {
  if (item.id != null) {
    console.log("item being liked: ", item.id);
    updateUserLikedArray(item.id, "remove");
  }
  return {
    type: REMOVE_LIKED_ITEM,
    payload: item,
  };
};

export const addLikedMovies = (likedMovies) => ({
  type: ADD_LIKED_MOVIES,
  payload: likedMovies,
});
