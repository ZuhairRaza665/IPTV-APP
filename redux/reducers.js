// reducers.js
import {
  ADD_LIKED_ITEM,
  REMOVE_LIKED_ITEM,
  REMOVE_CONTINUE_WATCHING,
  ADD_CONTINUE_WATCHING,
  UPDATE_CONTINUE_WATCHING,
} from "./actions";
import { ADD_LIKED_MOVIES } from "./actions";

const initialState = {
  likedItems: [],
  continueWatching: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LIKED_MOVIES:
      return {
        ...state,
        likedItems: action.payload,
      };
    case ADD_LIKED_ITEM:
      return {
        ...state,
        likedItems: [...state.likedItems, action.payload],
      };
    case REMOVE_LIKED_ITEM:
      return {
        ...state,
        likedItems: state.likedItems.filter(
          (likedItem) => likedItem.title !== action.payload.title
        ),
      };
    case ADD_CONTINUE_WATCHING:
      return {
        ...state,
        continueWatching: [...state.continueWatching, action.payload],
      };
    case REMOVE_CONTINUE_WATCHING:
      return {
        ...state,
        continueWatching: state.continueWatching.filter(
          (item) => item.title !== action.payload.title
        ),
      };
    case UPDATE_CONTINUE_WATCHING:
      const updatedItems = state.continueWatching.map((item) => {
        if (item.title === action.payload.item.title) {
          // Update the item's time property (or any other property you want to update)
          return { ...item, time: action.payload.newTimeValue };
        }
        return item;
      });

      return {
        ...state,
        continueWatchingItems: updatedItems,
      };

    default:
      return state;
  }
};

export default rootReducer;
