import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { updateContinueWatching } from "../updateUserLikedArray";
import { useDispatch } from "react-redux";

const VideoScreen = ({ route }) => {
  const { item } = route.params;
  const { time } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(true);
  const [isVideoStuck, setIsVideoStuck] = useState(false);
  let videoLink = item.link;
  const dispatch = useDispatch();

  console.log("Item link: ", item.link);
  console.log("Item title: ", item.title);
  console.log("Videos time: ", time);

  const handleVideoLoad = () => {
    setIsLoading(false);
    setIsVideoReady(true);
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (
      status.isLoaded &&
      !status.isPlaying &&
      status.playableDurationMillis > 0 &&
      status.positionMillis === status.playableDurationMillis
    ) {
      setIsVideoStuck(true);
    } else {
      setIsVideoStuck(false);
    }

    if (status.isPlaying) {
      // Log the video time when paused or stopped
      // console.log("Video time: ", status.positionMillis);
      updateContinueWatching(item, status.positionMillis, null, dispatch);
    }
  };

  // useEffect(() => {
  //   const unlockOrientation = async () => {
  //     await ScreenOrientation.unlockAsync();
  //   };

  //   unlockOrientation();

  //   return () => {
  //     ScreenOrientation.unlockAsync();
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: videoLink }}
          style={[styles.video]}
          // shouldPlay
          useNativeControls
          positionMillis={time} // time to forward
          onLoad={handleVideoLoad}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#0B0B0B",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  stuckContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  stuckText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
};

export default VideoScreen;
