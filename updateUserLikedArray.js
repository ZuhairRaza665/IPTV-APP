import { auth, db } from "./firebase"; // Import the Firebase initialization
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore"; // Import Firestore functions

export const updateUserLikedArray = async (itemTitle, action) => {
  const userID = auth.currentUser.uid.toString();

  try {
    const userDocRef = doc(db, "users", userID);

    // Get the current data of the user document
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      if (action === "add") {
        // Update the 'liked' array with the new value
        const newLikedArray = [...userData.liked, itemTitle];
        await updateDoc(userDocRef, { liked: newLikedArray });
      } else if (action === "remove") {
        const newLikedArray = userData.liked.filter(
          (item) => item !== itemTitle
        );
        await updateDoc(userDocRef, { liked: newLikedArray });
      }

      // console.log("Liked array updated for user:", userID);
    } else {
      // console.log("User document not found:", userID);
    }
  } catch (error) {
    console.error("Error updating liked array:", error);
  }
};

export const updateContinueWatching = async (itemTitle, time, action) => {
  const userID = auth.currentUser.uid.toString();

  try {
    const userDocRef = doc(db, "users", userID);

    // Get the current data of the user document
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const continueWatchingArray = userData["Continue Watching"];

      if (action === "remove") {
        const newContinueWatchingArray = continueWatchingArray.filter(
          (item) => item.title !== itemTitle
        );
        await updateDoc(userDocRef, {
          "Continue Watching": newContinueWatchingArray,
        });
      } else {
        let exist = false;
        let itemIndex = -1;

        userData["Continue Watching"].map((existingItem, index) => {
          if (existingItem.title === item.title) {
            exist = true;
            itemIndex = index;
          }
        });

        console.log("Index is: ", itemIndex);
        if (exist) {
          //updating
          const updatedContinueWatching = (userData["Continue Watching"][
            itemIndex
          ].time = newTimeValue);

          await updateDoc(userDocRef, {
            "Continue Watching": updatedContinueWatching,
          });
        } else {
          //adding
          const newContinueWatchingArray = [
            ...continueWatchingArray,
            { title: itemTitle, time: time },
          ];
          await updateDoc(userDocRef, {
            "Continue Watching": newContinueWatchingArray,
          });
        }
      }

      // console.log("Liked array updated for user:", userID);
    } else {
      // console.log("User document not found:", userID);
    }
  } catch (error) {
    console.error("Error updating liked array:", error);
  }
};
