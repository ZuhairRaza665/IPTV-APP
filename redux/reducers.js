// reducers.js
import { ADD_LIKED_ITEM, REMOVE_LIKED_ITEM } from "./actions";
import { ADD_LIKED_MOVIES } from "./actions";

const initialState = {
  likedItems: [],
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
          (likedItem) => likedItem.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
};

export default rootReducer;
