import React, { useState } from "react";
import { View, Text, Image, Button, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker"; // expo install expo-image-picker でインストール
import * as Permissions from "expo-permissions"; // expo install expo-permissions でインストール

import Colors from "../constants/Colors";

const ImgPicker = (props) => {
  const [pickedImage, setPickedImage] = useState();

  const verifyPermission = async () => {
    // アプリがカメラへアクセスする許可を求める（Androidでは Permissions を使用する必要がないらしいが）
    // Permissions.askAsyncの結果は自動的にスマホに保存される
    // result はプログラムの処理上返り値を保存しているだけ
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    // 許可が得られなかったら false を返す
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant camera permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    // 許可が得られなかったら true を返す
    return true;
  };

  const takeImageHandler = async () => {
    // アプリがカメラへアクセスする許可を求める
    const hasPermission = await verifyPermission();
    // 許可が得られなかったら処理を終了
    if (!hasPermission) {
      return;
    }
    // 許可が得られたらカメラを起動する
    // image には撮影された画像が格納される
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    // image.uri に画像を仮置きしているローカルのファイルパスが格納されている
    setPickedImage(image.uri);
    // 親コンポーネントに画像のパスを渡す(実際に Redux へ dispatch しているのは親コンポーネントなので)
    props.onImageTaken(image.uri);
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No Image picked yet.</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
      <Button
        title="Take Image"
        color={Colors.primary}
        onPress={takeImageHandler}
      />
    </View>
  );
};

export default ImgPicker;

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center",
    marginBottom: 15,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

// 一度 Expo Go で 許可を与えた後に Permissions.askAsync を実行しても許可のプロンプトが表示されないので
// その場合は Expo Go をアンインストールしてテストしましょう
