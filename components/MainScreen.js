import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PushNotification from 'react-native-push-notification';
navigator.geolocation = require('@react-native-community/geolocation');
import { openDatabase } from 'react-native-sqlite-storage';
import { getDistance } from 'geolib';

var db = openDatabase({ name: 'DTMLane.db', createFromLocation: 1 });

const MainScreen = ({ navigation }) => {
  let [imgLat, setImgLat] = useState(0);
  let [imgLong, setImgLong] = useState(0);
  const [data, setData] = useState([]);

  var temp = [];
  var FindImages = [];
  const [foundImages, setfoundImages] = useState([]);

  useEffect(() => {
    createChannel();
    console.log(foundImages);
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        if (notification.action == 'View') {
          navigation.navigate('SlideShow', { fArray: foundImages });
        }
        if (notification.action == 'Cancel') {
          PushNotification.cancelLocalNotifications({
            channelId: 'test-channel',
          });
        }
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, [foundImages]);

  // 1
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // 2
  useEffect(() => {
    if (imgLat && imgLong) {
      fetchAllRecord();
    }
  }, [imgLat, imgLong]);

  // 3
  useEffect(() => {
    if (data.length > 0) {
      CheckCurrentLocationImages();
    }
  }, [data]);

  //4
  useEffect(() => {
    if (foundImages.length > 0) {
      TestPush();
    }
  }, [foundImages]);

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
    });
  };

  const TestPush = () => {
    PushNotification.localNotification({
      channelId: 'test-channel', // (required)
      title: 'Memories',
      message: 'You have Some Picture at this location.',
      actions: '["Cancel","View"]',
    });
  };

  const getCurrentLocation = async () => {
    let nav = await navigator.geolocation.getCurrentPosition(position => {
      setImgLat(position.coords.latitude),
        setImgLong(position.coords.longitude);
    });
  };

  const fetchAllRecord = async () => {
    let dbs = await db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM ImgData',
        [],
        (tx, results) => {
          var len = results.rows.length;
          // debugger;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setData(temp);
            console.log('Data:', data);
          } else {
            console.log('Rows Effected: ', results.rows);
          }
        },
        error => {
          debugger;
        },
      );
    });
  };

  const CheckCurrentLocationImages = async () => {
    for (let i = 0; i < data.length; i++) {
      var lat1 = data[i].Latitude;
      var long1 = data[i].Longitude;
      var dis = await getDistance(
        { latitude: lat1, longitude: long1 },
        { latitude: imgLat, longitude: imgLong },
      );
      if (dis <= 1000) {
        FindImages.push(data[i]);
      }
    }
    let temp = [];
    for (let i = 0; i < FindImages.length; i++) {
      temp.push(FindImages[i].ImgName);
    }
    setfoundImages(temp);
  };

  return (
    <View style={styles.center}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Gallery')}>
        <Image
          source={require('./Pic/glogo1.jpg')}
          style={{
            width: 80,
            height: 80,
          }}
        />
        <Text style={{ fontSize: 20 }}> Gallery Images </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Saved')}>
        <Image
          source={require('./Pic/slogo.jpg')}
          style={{
            width: 80,
            height: 80,
          }}
        />
        <Text style={{ fontSize: 20 }}> Database Images </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PicOnLocation')}>
        <Image
          source={require('./Pic/cityIcon.png')}
          style={{
            width: 70,
            height: 75,
          }}
        />
        <Text style={{ fontSize: 20 }}>Pictures On Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
});

export default MainScreen;
