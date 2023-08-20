import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import LoadingAnimation from "../assets/loading.json";
import DoneAnimation from "../assets/animation_lkylf2yt.json";
import ErrorAnimation from "../assets/error.json";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { fetchData, movies, showsName } from "../api";
import { fData, getLikedData } from "../MovieDetailsRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { resetFlag, setResetFlag } from "./SignoutScreen";
import { useSelector, useDispatch } from "react-redux";
import { addLikedItem } from "../redux/actions";

import { auth, db } from "../firebase"; // Import the Firebase initialization
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { store } from "../redux/store";

const LoginScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingAnimation, setloadingAnimation] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading");
  const [DoneAnimationCompleted, setDoneAnimationCompleted] = useState(false);
  const [shouldResetAnimations, setShouldResetAnimations] = useState(false); // Add this state
  const [apiData, setApiData] = useState([]);
  const [textInputValue, setTextInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const likedItems = useSelector((state) => state.likedItems);
  const translateY = useSharedValue(0); // Initial position
  const [userId, setUserId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    console.log("Liked array getting updated");
    setRefresh(true);
  }, [likedItems]);

  const handleLogin = async () => {
    const usernameIndex = textInputValue.indexOf("username=") + 9;
    const passwordIndex = textInputValue.indexOf("password=") + 9;

    const passwordEndIndex = textInputValue.indexOf("&", passwordIndex);

    const username = textInputValue.substring(
      usernameIndex,
      textInputValue.indexOf("&", usernameIndex)
    );

    const password = textInputValue.substring(
      passwordIndex,
      passwordEndIndex !== -1 ? passwordEndIndex : undefined
    );

    console.log("username: ", username);
    console.log("password: ", password);

    try {
      await signInWithEmailAndPassword(
        auth,
        `${username}@yourdomainname.com`,
        `${password}`
      );
      console.log("Done logging in");
      const userId = auth.currentUser.uid;

      // Update the userId state with the authenticated user's ID
      setUserId(userId);

      // Reference to the user's document
      const userDocRef = doc(db, "users", userId);

      // Get the user's document data
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const likedList = userData.liked || [];

        if (userId) {
          await getLikedData(likedList, dispatch); // Pass the userId
        }
        console.log("User's liked list from login:", likedList);
        console.log("Updated Redux state:", store.getState().likedItems); // Log the updated state
        // setloadingAnimation(false);
      } else {
        console.log("User document not found:", userId);
      }
    } catch (loginError) {
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          `${username}@yourdomainname.com`,
          `${password}`
        );
        console.log("Done creating a new user");

        const usersCollectionRef = collection(db, "users");

        // Check if the "users" collection exists
        const checkUsersCollection = async () => {
          try {
            const querySnapshot = await getDocs(usersCollectionRef);

            if (querySnapshot.size > 0) {
              console.log("The 'users' collection exists");

              const userDocRef = doc(db, "users", userCredentials.user.uid);
              await setDoc(userDocRef, { liked: [] });
              console.log("User document added:", userCredentials.user.uid);
            } else {
              console.log("The 'users' collection doesn't exist");
            }
          } catch (error) {
            console.error("Error checking 'users' collection:", error);
          }
        };

        checkUsersCollection();
      } catch (createUserError) {
        console.error("Error in creating user");
      }
    }
  };

  const fetchDataAndProcess = async () => {
    try {
      console.log("textInputValue changed:", textInputValue);
      const data = await fetchData(textInputValue);
      setApiData(data);

      if (data.length <= 0) {
        setErrorMessage("Please enter a valid link.");
        setloadingAnimation(false);
        return; // Exit the function
      }

      const storedData = await AsyncStorage.getItem("movies");

      if (storedData) {
        console.log("Fetching data from local storage 2");
        console.log("Movies length before:  ", movies.length);
        console.log("movies stored data: ", movies[100]);
        console.log("Show name stored data: ", showsName[100]);
        const parsedStoredData = JSON.parse(storedData);

        parsedStoredData.forEach((storedItem, index) => {
          movies[index] = storedItem;
        });

        console.log("demo stored data: ", parsedStoredData[2131]);
        console.log("movies chached stored data: ", movies[2131]);
        console.log("Movies length after:  ", movies.length);
      } else {
        if (movies[0] != null) {
          console.log("Logging movies 0 from login screen: ", movies[0]);
          await fData();
          console.log("Movie 1: ", movies[movies.length]);
          console.log("Movie 2: ", movies[movies.length - 1]);
          console.log("Movie 3: ", movies[movies.length - 50]);

          try {
            await AsyncStorage.setItem("movies", JSON.stringify(movies));
            console.log("movies array stored in AsyncStorage");
          } catch (error) {
            console.error("Error storing movies array:", error);
          }
        } else {
          console.log("API not working");
          setText("API not working");
        }
      }
      setloadingAnimation(false);
    } catch (error) {
      console.error("Error fetching or processing data:", error);
    }
  };

  const moveUp = () => {
    translateY.value = withTiming(-50, {
      duration: 500,
      easing: Easing.linear,
    }); // how much will the done logo go up and in how much time

    setTimeout(() => {
      handleDoneAnimationComplete();
    }, 500); // when will done button appear
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleDoneAnimationComplete = () => {
    setDoneAnimationCompleted(true);
    setShouldResetAnimations(true); // Set the flag to reset animations
  };

  const toggleModal = () => {
    setModalVisible(false); // Hide the modal

    if (apiData.length > 0) {
      console.log("Greater than 0");
      navigation.navigate("Container");
    } else {
      console.log("Less than 0");
      setShouldResetAnimations(false);
      setloadingAnimation(true);
      setDoneAnimationCompleted(false);
      translateY.value = 0; // Reset translateY
      setLoadingText("Loading");
      setResetFlag(false);
    }
  };
  const LoginBtnHandle = () => {
    if (textInputValue.length > 0) {
      setModalVisible(!isModalVisible);
      fetchDataAndProcess();
    } else {
      setErrorMessage("Please enter a valid link.");
    }
  };

  useEffect(() => {
    if (apiData.length > 0) {
      handleLogin();
      console.log("data: ", apiData[0]);
    }
  }, [apiData]);

  useEffect(() => {
    if (resetFlag) {
      setShouldResetAnimations(false);
      setloadingAnimation(true);
      setDoneAnimationCompleted(false);
      translateY.value = 0; // Reset translateY
      setLoadingText("Loading");
      setResetFlag(false);
    }
  }, [resetFlag]);

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingText((prevText) => {
        if (prevText === "Loading....") {
          return "Loading";
        } else {
          return prevText + ".";
        }
      });
    }, 500); // Change text every 500ms

    return () => {
      clearInterval(loadingInterval); // Clean up the interval on component unmount
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      {errorMessage.length > 0 && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="https://example.com"
        placeholderTextColor="white"
        autoCapitalize="none"
        onChangeText={(text) => {
          setTextInputValue(text);
          setErrorMessage(""); // Clear the error message when input changes
        }}
      />
      <TouchableOpacity style={styles.button} onPress={LoginBtnHandle}>
        <Text style={styles.text3}>Login</Text>
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loadingAnimation ? (
              <View style={styles.activityIndicatorContainer}>
                <Text style={styles.text2}>{loadingText}</Text>
                <LottieView
                  source={LoadingAnimation}
                  autoPlay
                  loop
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ) : (
              <View style={styles.modalContainer2}>
                <Animated.View style={animatedStyle}>
                  <LottieView
                    source={apiData.length > 0 ? DoneAnimation : ErrorAnimation}
                    autoPlay
                    loop={false}
                    style={[
                      apiData.length > 0
                        ? styles.doneAnimation
                        : styles.errorAnimation,
                    ]}
                    onAnimationFinish={moveUp}
                  />
                </Animated.View>
                {DoneAnimationCompleted && (
                  <TouchableOpacity
                    style={[
                      apiData.length > 0 ? styles.doneBtn : styles.doneBtn2,
                    ]}
                    onPress={toggleModal}
                  >
                    <Text style={styles.doneBtnText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Align the modal content at the bottom
    bottom: 10,
    borderBottomEndRadius: 200,
  },
  modalContainer2: {
    flex: 1,
    backgroundColor: "#212020",
  },
  modalContent: {
    backgroundColor: "#212020",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10, // Add this line to keep the bottom corners straight
    borderBottomRightRadius: 10, // Add this line to keep the bottom corner
    height: 300,
  },
  text: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
    alignItems: "center",
    alignSelf: "center",
  },
  text2: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    alignItems: "center",
    alignSelf: "center",
    top: 30,
  },
  text3: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    alignSelf: "center",
  },
  doneBtnText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    alignItems: "center",
    alignSelf: "center",
  },
  input: {
    fontSize: 18,
    height: 40,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,
    color: "white",
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 2,
    marginTop: 60,
  },
  button: {
    height: 45,
    width: 100,
    borderColor: "white",
    color: "white",
    borderWidth: 2,
    fontSize: 18,
    textAlign: "center",
    alignSelf: "center",
    padding: 8,
    marginTop: 60,
  },
  doneBtn: {
    height: 50,
    textAlign: "center",
    alignSelf: "center",
    bottom: 60,
  },
  doneBtn2: {
    height: 50,
    textAlign: "center",
    alignSelf: "center",
    top: 100,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  doneAnimation: {
    width: "100%",
    height: "100%",
  },
  errorAnimation: {
    width: 100,
    height: 100,
    alignSelf: "center",
    right: "17%",
    top: 40,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    alignSelf: "center",
    marginTop: 10,
  },
});

export default LoginScreen;
