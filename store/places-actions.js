import * as FileSystem from "expo-file-system";
import { insertPlace, fetchPlaces } from "../helpers/db";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";

export const addPlace = (title, image, location) => {
  return async (dispatch) => {
    // GoogleのgeolocationAPIを使えば緯度経度をヒューマンリーダブルな住所に変換できる
    // クレカが必要なので今回はパスしました
    const address = "D." + location.lat;

    // 自動生成されたパスから末尾のファイル名を取得
    const fileName = image.split("/").pop();
    // ファイル保存先のパスを完成させる
    const newPath = FileSystem.documentDirectory + fileName;
    try {
      // 仮置きされた画像データをスマホの本置きファイルシステムに移動する
      await FileSystem.moveAsync({
        from: image,
        to: newPath,
      });

      // Place をDBに保存する
      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng
      );

      // Redux Reducer にアクションをディスパッチする
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: {
            lat: location.lat,
            lng: location.lng,
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async (dispatch) => {
    try {
      const dbResult = await fetchPlaces();
      dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};

// FileSystem.documentDirectory
// → ここに格納されたデータはアプリがアンインストールされるまで残る
