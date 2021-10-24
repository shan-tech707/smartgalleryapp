import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  BackHandler,
} from 'react-native';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import CameraRoll from '@react-native-community/cameraroll';
import CheckBox from '@react-native-community/checkbox';

const windowWidth = Dimensions.get('window').width;
const columns = 4;

const PicScreen = ({ navigation }) => {
  const [dataSrc, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [enableCheck, setEnableCheck] = useState(false);
  const [count, setCount] = useState(0);
  const selected = [];

  const getPhotos = () => {
    CameraRoll.getPhotos({
      first: 5000,
      assetType: 'Photos',
      groupTypes: 'any',
    })
      .then(res => {
        setData(res.edges);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const askPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message: 'App needs access to your Gallery ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (result !== 'granted') {
        console.log('Access to pictures was denied');
        return;
      } else {
        console.log('permission granted');
        getPhotos();
      }
    }
  };

  const onCheckChange = (value, item, index) => {
    let temp = [...dataSrc];
    item.selected = value;
    temp[index] = item;
    setData(temp);
    if (value == true) {
      setCount(count + 1);
      selected.push(temp[index]);
    } else {
      setCount(count - 1);
    }
  };

  useEffect(() => {
    askPermission();
  }, []);

  const _goBack = () => {
    Alert.alert('Exit!', 'Are you sure you want to exit app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
    ]);
  };

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
          <Appbar.BackAction onPress={_goBack} color={'white'} />
          <Appbar.Content title="Photo Gallery" color={'white'} />
        </Appbar.Header>
      )}

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#212121" />
      ) : (
        <FlatList
          data={dataSrc}
          numColumns={columns}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ImageDetails', { uri: item.node.image.uri })
              }
              onLongPress={() => {
                setEnableCheck(true);
              }}>
              <Image
                style={styles.itemContext}
                source={{
                  uri: item.node.image.uri,
                }}
              />
              {enableCheck ? (
                <CheckBox
                  disabled={false}
                  style={{ position: 'absolute' }}
                  value={item.selected}
                  onValueChange={value => onCheckChange(value, item, index)}
                  tintColors={{ true: '#1AAB4B' }}
                />
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default PicScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
