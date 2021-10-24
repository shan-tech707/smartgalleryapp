import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Modal,
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import { Appbar } from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import { openDatabase } from 'react-native-sqlite-storage';

const { windowWidth, windowHeight } = Dimensions.get('screen');

var db = openDatabase({ name: 'DTMLane.db', createFromLocation: 1 });

export default function ImageDetails({ route, navigation }) {
  let { uri } = route.params;
  let [imgPath, setImgPath] = useState(uri);
  let [imgName, setImgName] = useState('');
  let [imgEvent, setImgEvent] = useState('');

  let [imgDate, setImgDate] = useState('01-01-2020');
  let [imgLocation, setImgLocation] = useState('');
  let [cityName, setcityName] = useState('');
  let [imgLat, setImgLat] = useState(0);
  let [imgLong, setImgLong] = useState(0);
  let [showDia, setShowDia] = React.useState(false);
  let [marg, setMarg] = React.useState(1);

  const [pin, setPin] = React.useState({
    coordinate: {
      latitude: 33.6509624,
      longitude: 73.0682577,
    },
  });

  const insertData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ImgData (ImgName , Person, Event , Date , Location , City , Latitude , Longitude) VALUES (?,?,?,?,?,?,?,?)',
        [
          imgPath,
          imgName,
          imgEvent,
          imgDate,
          imgLocation,
          cityName,
          imgLat,
          imgLong,
        ],
        (tx, results) => {
          console.log('Insert Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'MetaData inserted successfully',
              [{ text: 'Ok', onPress: () => navigation.navigate('Picture') }],
              { cancelable: false },
            );
          } else {
            alert('Insertion Failed');
          }
        },
      );
    });
  };

  let showAllData = () => {
    if (!imgName) {
      alert('Please fill Name');
      return;
    }
    if (!imgEvent) {
      alert('Please fill Event ');
      return;
    }
    if (!imgLocation) {
      alert('Location is Missing');
      return;
    }
    if (!cityName) {
      alert('City Name is Missing');
      return;
    }
    if (!imgLat && !imgLong) {
      alert('Lat and Long Missing ');
      return;
    }
    insertData();
  };

  const getAddress = async (lat, lng) => {
    await Geocoder.fallbackToGoogle('AIzaSyBi5iDQR8HBU1pSpMMHnEdL8uZvf5yRq2M');
    try {
      const res = await Geocoder.geocodePosition({ lat, lng });
      let address = res?.[0]?.formattedAddress;
      let city = res?.[0]?.locality;
      setcityName(city);
      return res?.[0]?.formattedAddress;
    } catch (error) {
      alert('Error:' + error);
    }
  };

  const InsertIntoInputText = async () => {
    setShowDia((showDia = false));
    const address = await getAddress(imgLat, imgLong);
    setImgLocation(address);
  };

  return (
    <View style={styles.container1}>
      <Image
        style={styles.imageContext}
        backgroundColor="black"
        source={{ uri: uri }}
      />
      <ScrollView style={{ flex: 2 }}>
        <View style={{ flexx: 2 }}>
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
            <TextInput
              placeholder="Name"
              onChangeText={imgName => setImgName(imgName)}
              style={styles.inputText}
            />

            <TextInput
              placeholder="Event Name"
              onChangeText={imgEvent => setImgEvent(imgEvent)}
              style={styles.inputText}
            />

            <DatePicker
              style={{
                width: 400,
                marginTop: 10,
                marginBottom: 10,
              }}
              date={imgDate}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate="01-01-2020"
              maxDate="01-01-2025"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'relative',
                },
                dateInput: {
                  marginStart: 10,
                  borderWidth: 1,
                  borderColor: 'black',
                  borderRadius: 10,
                  backgroundColor: 'white',
                  alignItems: 'flex-start',
                  padding: 5,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={imgDate => {
                setImgDate(imgDate);
              }}
            />

            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.heading}>Place</Text>
              </View>

              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={showDia => setShowDia((showDia = true))}>
                  <Appbar.Action
                    style={{ backgroundColor: '#F7D8D1' }}
                    icon="plus"
                    color={'black'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              placeholder="Location"
              editable={false}
              multiline={true}
              numberOfLines={2}
              value={imgLocation}
              style={styles.inputText}
            />

            <TextInput
              placeholder="City Name"
              editable={false}
              multiline={true}
              value={cityName}
              style={styles.inputText}
            />

            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.heading}>Latitude:</Text>
              </View>

              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <TextInput
                  placeholder="Latitude"
                  editable={false}
                  multiline={true}
                  value={imgLat.toString()}
                  style={[styles.inText]}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.heading}>Longitude:</Text>
              </View>

              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <TextInput
                  placeholder="Longitude"
                  editable={false}
                  multiline={true}
                  value={imgLong.toString()}
                  style={styles.inText}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <TouchableOpacity style={styles.button} onPress={showAllData}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/*  MOdal for Map */}
      <Modal visible={showDia}>
        <View style={{ flex: 1 }}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            fetchDetails={true}
            GooglePlacesSearchQuery={{
              rankby: 'distance',
            }}
            // animate to region
            onPress={(data, details = null) => {
              setPin({
                coordinate: {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                },
              });
              setImgLat(details.geometry.location.lat);
              setImgLong(details.geometry.location.lng);
            }}
            query={{
              key: 'AIzaSyB0jL1UynH8oiYqWNaAA-MfFCyZ76l61Ro',
              language: 'en',
              components: 'country:pk',
              types: 'establishment',
              radius: 30000,
              location: `${pin.latitude}, ${pin.longitude}`,
            }}
            styles={{
              container: {
                flex: 0,
                position: 'absolute',
                width: '100%',
                zIndex: 1,
              },
              listView: { backgroundColor: 'white' },
            }}
          />

          {/* <View style={{
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
          </View> */}
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
            autoFocus={true}
            onPress={e => {
              setPin(
                {
                  coordinate: e.nativeEvent.coordinate,
                },
                console.warn(pin.coordinate),
              );
              setImgLat(e.nativeEvent.coordinate.latitude);
              setImgLong(e.nativeEvent.coordinate.longitude);
            }}
            // onRegionChange={(region) => setPin({
            //   coordinate: region
            // })}
            onRegionChangeComplete={pin =>
              setPin({
                coordinate: pin,
              })
            }
            onMapReady={() => setMarg(0)}>
            {/* <Marker
              coordinate={{
                latitude: pin.coordinate.latitude,
                longitude: pin.coordinate.longitude,
              }}
            /> */}
          </MapView>

          <View
            style={{
              position: 'absolute', //use absolute position to show button on top of the map
              marginTop: 50,
              alignSelf: 'center',
              bottom: 40,
            }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                backgroundColor: '#FFFEFA',
                alignSelf: 'center',
                alignContent: 'center',
                width: 100,
                height: 50,
                padding: 5,
                borderRadius: 10,
              }}
              onPress={InsertIntoInputText}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonCallout: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderRadius: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  popUp: {
    marginLeft: 200,
    marginRight: 30,
    marginBottom: 450,
    marginTop: 25,
    backgroundColor: '#ffffff',
    flex: 1,
    borderRadius: 8,
    padding: 10,
  },
  imageContext: {
    flex: 0.5,
    width: '100%',
    height: windowHeight,
    resizeMode: 'contain',
  },
  container1: {
    flex: 1,
  },
  inputText: {
    margin: 10,
    backgroundColor: 'white',
    width: 350,
    borderRadius: 10,
    marginStart: 10,
    marginEnd: 10,
    fontSize: 16,
    padding: 5,
    borderWidth: 1,
  },
  inText: {
    margin: 10,
    backgroundColor: 'white',
    width: 250,
    borderRadius: 10,
    marginStart: 10,
    marginEnd: 10,
    fontSize: 16,
    padding: 5,
    borderWidth: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#D77660',
    padding: 10,
    margin: 20,
    borderRadius: 10,
  },
  mapbutton: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    padding: 10,
    margin: 10,
  },
  heading: {
    marginTop: 10,
    marginLeft: 12,
    fontSize: 16,
    width: 85,
    fontWeight: 'normal',
    alignSelf: 'flex-start',
  },
  appbar: {
    backgroundColor: '#37B6FA',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
});
