import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";

const VideoScreen = ({ route }) => {
  const { item } = route.params;
  const videoUrl = item.link;
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoStuck, setIsVideoStuck] = useState(false);

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
  };

  useEffect(() => {
    const unlockOrientation = async () => {
      await ScreenOrientation.unlockAsync();
    };

    unlockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: videoUrl }}
          style={[styles.video]}
          shouldPlay
          useNativeControls
          // positionMillis={3600 * 1000} // time to forward
          onLoad={handleVideoLoad}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          resizeMode="contain"
        />
        {/* {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
        )} */}
        {/* {isVideoStuck && (
          <View style={styles.stuckContainer}>
            <Text style={styles.stuckText}>
              Video is stuck. Please try again.
            </Text>
          </View>
        )} */}
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
