import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text, View,
  SafeAreaView, StyleSheet,
  Image, Dimensions,
  TouchableOpacity
} from 'react-native';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'DTMLane.db', createFromLocation: 1 })
const windowWidth = Dimensions.get('window').width;
const columns = 4;


const SavedScreen = ({ navigation }) => {

  let [flatListItems, setFlatListItems] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [enableCheck, setEnableCheck] = useState(false);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM ImgData',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        });
    });
  }, []);

  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       'DELETE FROM  ImgData where ImgName=? and Person=? and Latitude=? and Longitude=?',
  //       ["file:///storage/emulated/0/CooCooWhatsApp/coocoo_statuses/6131244626b54907a72fc89b60fd5b41.jpg", "Ayesha ", 33.56713472418972, 73.03029857575895],
  //       (tx, results) => {
  //         console.log('Results', results.rowsAffected);
  //         if (results.rowsAffected > 0) {
  //           Alert.alert(
  //             'Success',
  //             'User deleted successfully',
  //             [
  //               {
  //                 text: 'Ok',
  //                 onPress: () => navigation.navigate('HomeScreen'),
  //               },
  //             ],
  //             { cancelable: false }
  //           );
  //         } else {
  //           alert('Please insert a valid User Id');
  //         }
  //       }
  //     );
  //   });
  // }, [])

  useEffect(() => {
    console.log("Flat List: ", flatListItems)
  }, [flatListItems])

  const _handleSearch = () => {
    navigation.navigate('SearchScreen');
  };

  const _handleMore = () => { };

  const disableChecks = () => {
    setEnableCheck(false);
    setCount(0);
  };

  return (
    <View style={styles.container}>
      {enableCheck ? (
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={disableChecks} color={'white'} />
          <Appbar.Content title={count} color={'white'} />
        </Appbar.Header>
      ) : (
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => navigation.navigate("Main")} color={'white'} />
          <Appbar.Content title="Database Images" color={'white'} />
          <Appbar.Action
            icon="magnify"
            color={'white'}
            onPress={_handleSearch}
          />
          <Appbar.Action
            icon="dots-vertical"
            onPress={_handleMore}
            color={'white'}
          />
        </Appbar.Header>
      )}
      {/* {isLoading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#212121" />
            ) : ( */}
      <FlatList
        data={flatListItems}
        numColumns={columns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Image
            style={styles.itemContext}
            source={{
              uri: item.ImgName,
            }}
          />
        )}
      />
      {/* )} */}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContext: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    width: windowWidth / columns,
    height: windowWidth / columns,
  },
  appbar: {
    backgroundColor: '#212121',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  background: {
    backgroundColor: 'white',
    flex: 1,
  },
  headline_text: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    marginLeft: 20
  },
  ImgageSty: {
    marginLeft: 20,
    width: 110,
    height: 110,
  },
  explore_text: {
    marginTop: 5,
    marginBottom: 10,
    color: 'black',
    marginLeft: 20,
    fontSize: 12,
    fontWeight: '600',
  },

});

export default SavedScreen;