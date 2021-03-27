import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import ENV from "../env";

const MapPreview = (props) => {
  let imagePreviewUrl;

  if (props.location) {
    // このマップサービスを使いました → https://developer.here.com/documentation/map-image/dev_guide/topics/examples-map-viewtype-0.html
    // すぐにAPIキーが失効するので注意！特に「PICK ON MAP」が全然機能しなくなる。
    imagePreviewUrl = `https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=${ENV.mapApiKey}&lat=${props.location.lat}&lon=${props.location.lng}&vt=0&z=14`;
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ ...styles.mapPreview, ...props.style }}
    >
      {props.location ? (
        <Image style={styles.mapImage} source={{ uri: imagePreviewUrl }} />
      ) : (
        props.children
      )}
    </TouchableOpacity>
  );
};

export default MapPreview;

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: "center",
    alignItems: "center",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
});
