import * as SQLite from "expo-sqlite"; // expo install expo-sqlite しました

// モバイルのDBと接続を確立する（DBが存在しなかったら新規にDBを作成する）
// このファイルが import された時点でこの接続が実行される
const db = SQLite.openDatabase("places.db");

// テーブルの定義
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    // .transaction を使うことで不完全なクエリはロールバックする
    // tx: transactionオブジェクト
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);",
        [],
        () => {
          // Success Function
          resolve();
        },
        (_, err) => {
          // Error Function
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const insertPlace = (title, imageUri, address, lat, lng) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?);",
        [title, imageUri, address, lat, lng], // bind values (?のところにサニタイズされた上で挿入される)
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const fetchPlaces = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM places;",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
