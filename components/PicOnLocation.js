import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { openDatabase } from 'react-native-sqlite-storage';
import { getDistance } from 'geolib';

var db = openDatabase({ name: 'DTMLane.db', createFromLocation: 1 })

const PicOnLocation = ({ navigation }) => {

  let [imgLat, setImgLat] = useState(0)
  let [imgLong, setImgLong] = useState(0)
  const [marg, setMarg] = React.useState(1)
  const [data, setData] = useState([]);

  var temp = [];
  var FindImages = [];

  const [pin, setPin] = React.useState({
    coordinate: {
      latitude: 33.6509624,
      longitude: 73.0682577,
    }
  })

  const [region, setRegion] = React.useState({
    latitude: 33.6509624,
    longitude: 73.0682577,
  })

  useEffect(() => {
    fetchAllRecord();
  }, [])


  const fetchAllRecord = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM ImgData", [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setData(temp);
            console.log("Data:", data)
          }
          else {
            console.log("Rows Effected: ", results.rows)
          }
        },
        (error) => {
          debugger;
        }
      );

    });

  }

  const CheckCurrentLocationImages = async () => {
    for (let i = 0; i < data.length; i++) {
      var lat1 = data[i].Latitude;
      var long1 = data[i].Longitude;
      var dis = await getDistance(
        { latitude: lat1, longitude: long1 },
        { latitude: imgLat, longitude: imgLong },
      );
      if (dis <= 1000) {
        FindImages.push(data[i])
      }
    }
    var fImages = []
    for (let i = 0; i < FindImages.length; i++) {
      fImages.push(FindImages[i].ImgName)
    }

    if (FindImages.length != 0) {
      navigation.navigate('SlideShow', { fArray: fImages })
    }

  }


  return (
    <View style={{ flex: 1 }}>

      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: "distance"
        }}
        onPress={(data, details = null) => {
          console.warn(data)
          console.warn(details)
          setPin({
            coordinate: {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            }
          })
          setImgLat(details.geometry.location.lat)
          setImgLong(details.geometry.location.lng)

        }}
        query={{
          key: "AIzaSyBi5iDQR8HBU1pSpMMHnEdL8uZvf5yRq2M",
          language: "en",
          components: "country:pk",
          types: "establishment",
          radius: 30000,
          location: `${region.latitude}, ${region.longitude}`
        }}
        styles={{
          container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
          listView: { backgroundColor: "white" }
        }} />

      <View style={{
        zIndex: 1,
        position: 'absolute',
        marginTop: -37,
        marginLeft: -11,
        left: '50%',
        top: '50%'
      }}>
        <Image
          source={{ uri: 'https://images-na.ssl-images-amazon.com/images/I/415y53wUJnL.png' }}
          style={{
            height: 50, width: 50,
          }}
          resizeMode='contain'
        />
      </View>
      <MapView
        style={[styles.map, { marginBottom: marg, marginTop: 40 }]}
        initialRegion={{
          latitude: pin.coordinate.latitude,
          longitude: pin.coordinate.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={(e) => {
          setPin(
            {
              coordinate: e.nativeEvent.coordinate
            }
            , console.warn(pin.coordinate)
          )
          setImgLat(e.nativeEvent.coordinate.latitude)
          setImgLong(e.nativeEvent.coordinate.longitude)
        }}
        onMapReady={() => setMarg(0)}>
      </MapView>
      <View
        style={{
          position: 'absolute',//use absolute position to show button on top of the map
          marginTop: 50,
          alignSelf: 'center',
          bottom: 40

        }} >
        <TouchableOpacity style={{
          alignItems: 'center',
          backgroundColor: "#FFFEFA",
          alignSelf: 'center',
          alignContent: 'center',
          width: 100,
          height: 50,
          padding: 5,
          borderRadius: 10
        }}
          onPress={CheckCurrentLocationImages}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>Done</Text>
        </TouchableOpacity>
      </View>

    </View>


  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PicOnLocation;