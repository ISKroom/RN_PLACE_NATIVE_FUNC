import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/Colors";

const MapScreen = (props) => {
  // PlaceDetailScreen から遷移してきた場合以下のパラメータが埋め込まれている
  const initialLocation = props.navigation.getParam("initialLocation");
  const readonly = props.navigation.getParam("readonly");

  // State (PlaceDetailScreen から遷移していない場合は initialLocation は undefined)
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  console.log(initialLocation);

  // 最初のマップ表示地点(PlaceDetailScreen から遷移してきた場合はマーカーの位置に指定)
  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // 経度と緯度をStateに保存する関数
  const selectLocationHandler = (event) => {
    // PlaceDetailScreen から遷移してきた場合は何もしない
    if (readonly) {
      return;
    }
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  // マップ上に表示するアイコンの位置
  let markerCoordinates;
  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  // コンポーネントから Save 機能を navigationOptions に渡す
  // 1. useCallback でコールバック関数を作成 (dependencies に指定した変数が変更されるたびに関数が更新さっる)
  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      // ロケーションを指定してないのにSaveしようとした場合は何もしない（Alertだしてもいい）
      return;
    }
    props.navigation.navigate("NewPlace", { pickedLocation: selectedLocation });
  }, [selectedLocation]);
  // 2. useEffect で以下のように関数を navigations に埋め込む
  useEffect(() => {
    props.navigation.setParams({ saveLocation: savePickedLocationHandler });
  }, [savePickedLocationHandler]);

  return (
    <MapView
      style={styles.map}
      initialRegion={mapRegion}
      onPress={selectLocationHandler}
    >
      {markerCoordinates && (
        <Marker title="Picked Location" coordinate={markerCoordinates} />
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = (navData) => {
  const saveFn = navData.navigation.getParam("saveLocation");
  const readonly = navData.navigation.getParam("readonly");
  // PlaceDetailScreen から遷移してきた場合は何も表示しない
  if (readonly) {
    return {};
  }
  return {
    headerRight: () => (
      <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
        <Text style={styles.headerButtonText}>Save</Text>
      </TouchableOpacity>
    ),
  };
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  headerButton: {
    marginHorizontal: 20,
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === "android" ? "white" : Colors.primary,
  },
});
