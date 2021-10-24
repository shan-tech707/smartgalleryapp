import React, {useState, useEffect} from 'react'
import {
   View,
   Text,
   StyleSheet,
   Dimensions,
   TextInput,
   TouchableOpacity,
   Modal,
   ScrollView,
   KeyboardAvoidingView,
} from 'react-native'

import {Appbar} from 'react-native-paper'
import {openDatabase} from 'react-native-sqlite-storage'
import DatePicker from 'react-native-datepicker'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import MapView from 'react-native-maps'
import {getDistance} from 'geolib'

const {windowWidth, windowHeight} = Dimensions.get('screen')

var db = openDatabase({name: 'DTMLane.db', createFromLocation: 1})

export default function TriggerPicture({navigation}) {
   let [Person, setPerson] = useState('')
   let [imgEvent, setImgEvent] = useState('')
   let [imgDate, setImgDate] = useState('')
   let [imgLat, setImgLat] = useState(0)
   let [imgLong, setImgLong] = useState(0)
   let [showDia, setShowDia] = React.useState(false)
   let [marg, setMarg] = React.useState(1)
   const [data, setData] = useState([])

   const [checked, setchecked] = useState(false)

   const [pin, setPin] = React.useState({
      coordinate: {
         latitude: 33.6509624,
         longitude: 73.0682577,
      },
   })

   var FindImages = []
   const [foundImages, setfoundImages] = useState([])

   useEffect(() => {
      fetchAllRecord()
   }, [])

   useEffect(() => {
      if (foundImages.length > 0) {
         navigation.navigate('SlideShow', {fArray: foundImages})
      } else if (checked == true) {
         alert('oOPs! Record Not Found.') 
      }
   }, [foundImages])

   const fetchAllRecord = async () => {
       db.transaction(tx => {
          tx.executeSql('SELECT * FROM ImgData', [], (tx, results) => {
             var temp = []
             for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i))
             setData(temp)
          })
       })
   }

   const getEvent = async () => {
       debugger
      // When Nothing is selected
      if (Person == '' && imgEvent == '' && imgDate == '' && imgLat == 0 && imgLong == 0) {
         for (let i = 0; i < data.length; i++) {
            FindImages.push(data[i])
         }
         let temp = []
         for (let i = 0; i < FindImages.length; i++) {
            temp.push(FindImages[i].ImgName)
         }
         setfoundImages(temp)
      }
      // only person Name
      if (
         Person != '' &&
         imgEvent == '' &&
         imgDate == '' &&
         imgLat == 0 &&
         imgLong == 0
      ) {
         for (let i = 0; i < data.length; i++) {
            if (data[i].Person.trim() == Person.trim()) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp = []
         for (let i = 0; i < FindImages.length; i++) {
            temp.push(FindImages[i].ImgName)
         }
         setfoundImages(temp)
      }
      // only Event
      if (
         Person == '' &&
         imgEvent != '' &&
         imgDate == '' &&
         imgLat == 0 &&
         imgLong == 0
      ) {
         for (let i = 0; i < data.length; i++) {
            if (data[i].Event.trim() == imgEvent.trim()) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp = []
         for (let i = 0; i < FindImages.length; i++) {
            temp.push(FindImages[i].ImgName)
         }
         setfoundImages(temp)
      }

      // only Date
      if (
         Person == '' &&
         imgEvent == '' &&
         imgDate != '' &&
         imgLat == 0 &&
         imgLong == 0
      ) {
         for (let i = 0; i < data.length; i++) {
            if (data[i].Date == imgDate) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp = []
         for (let i = 0; i < FindImages.length; i++) {
            temp.push(FindImages[i].ImgName)
         }
         setfoundImages(temp)
      }

      // only Location
      if (
         Person == '' &&
         imgEvent == '' &&
         imgDate == '' &&
         imgLat != 0 &&
         imgLong != 0
      ) {
         for (let i = 0; i < data.length; i++) {
            var lat1 = data[i].Latitude
            var long1 = data[i].Longitude
            var dis = await getDistance(
               {latitude: lat1, longitude: long1},
               {latitude: imgLat, longitude: imgLong},
            )
            if (dis <= 1000) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp = []
         for (let i = 0; i < FindImages.length; i++) {
            temp.push(FindImages[i].ImgName)
         }
         setfoundImages(temp)
      }

      // Person and Event
      if (
         Person != null &&
         imgEvent != '' &&
         imgDate == '' &&
         imgLat == 0 &&
         imgLong == 0
      ) {
         for (let i = 0; i < data.length; i++) {
            if (
               data[i].Person.trim() == Person.trim() &&
               data[i].Event.trim() == imgEvent.trim()
            ) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp = []
         for (let i = 0; i < FindImages.length; i++) {
            temp.push(FindImages[i].ImgName)
         }
         setfoundImages(temp)
      }

      // Person and Date
      if (
         Person != null &&
         imgEvent == '' &&
         imgDate != '' &&
         imgLat == 0 &&
         imgLong == 0
      ) {
         for (let i = 0; i < data.length; i++) {
            if (
               data[i].Person.trim() == Person.trim() &&
               data[i].Date == imgDate
            ) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp = []
         for (let i = 0; i < FindImages.length; i++) {
            temp.push(FindImages[i].ImgName)
         }
         setfoundImages(temp)
      }

      // Event And Date
      if (
         Person == '' &&
         imgEvent != '' &&
         imgDate != '' &&
         imgLat == 0 &&
         imgLong == 0
      ) {
         for (let i = 0; i < data.length; i++) {
            if (
               data[i].Event.trim() == imgEvent.trim() &&
               data[i].Date == imgDate
            ) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp = []
         for (let i = 0; i < FindImages.length; i++) {
            temp.push(FindImages[i].ImgName)
         }
         setfoundImages(temp)
      }

      // Person and location
      if (
         Person != '' &&
         imgEvent == '' &&
         imgDate == '' &&
         imgLat != 0 &&
         imgLong != 0
      ) {
         for (let i = 0; i < data.length; i++) {
            var lat1 = data[i].Latitude
            var long1 = data[i].Longitude
            debugger
            var dis = await getDistance(
               {latitude: lat1, longitude: long1},
               {latitude: imgLat, longitude: imgLong},
            )
            if (dis <= 1000) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp1 = []
         debugger
         for (let i = 0; i < FindImages.length; i++) {
            if (FindImages[i].Person.trim() == Person.trim()) {
               temp1.push(FindImages[i])
            }
         }
         let temp = []
         debugger
         for (let i = 0; i < temp1.length; i++) {
            temp.push(temp1[i].ImgName)
         }
         setfoundImages(temp)
      }

      // Event and location
      if (
         Person == '' &&
         imgEvent != '' &&
         imgDate == '' &&
         imgLat != 0 &&
         imgLong != 0
      ) {
         for (let i = 0; i < data.length; i++) {
            var lat1 = data[i].Latitude
            var long1 = data[i].Longitude
            debugger
            var dis = await getDistance(
               {latitude: lat1, longitude: long1},
               {latitude: imgLat, longitude: imgLong},
            )
            if (dis <= 1000) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp1 = []
         debugger
         for (let i = 0; i < FindImages.length; i++) {
            if (FindImages[i].Event.trim() == imgEvent.trim()) {
               temp1.push(FindImages[i])
            }
         }
         let temp = []
         debugger
         for (let i = 0; i < temp1.length; i++) {
            temp.push(temp1[i].ImgName)
         }
         setfoundImages(temp)
      }

      // Date and location
      if (
         Person == '' &&
         imgEvent != '' &&
         imgDate == '' &&
         imgLat != 0 &&
         imgLong != 0
      ) {
         for (let i = 0; i < data.length; i++) {
            var lat1 = data[i].Latitude
            var long1 = data[i].Longitude
            debugger
            var dis = await getDistance(
               {latitude: lat1, longitude: long1},
               {latitude: imgLat, longitude: imgLong},
            )
            if (dis <= 1000) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp1 = []
         debugger
         for (let i = 0; i < FindImages.length; i++) {
            if (FindImages[i].Date == imgDate) {
               temp1.push(FindImages[i])
            }
         }
         let temp = []
         debugger
         for (let i = 0; i < temp1.length; i++) {
            temp.push(temp1[i].ImgName)
         }
         setfoundImages(temp)
      }

      // Person and Event and Date
      if (
         Person != '' &&
         imgEvent != '' &&
         imgDate != '' &&
         imgLat == 0 &&
         imgLong == 0
      ) {
         for (let i = 0; i < data.length; i++) {
            if (
               data[i].Person.trim() == Person.trim() &&
               data[i].Event.trim() == imgEvent.trim() &&
               data[i].Date == imgDate
            ) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp = []
         for (let i = 0; i < FindImages.length; i++) {
            temp.push(FindImages[i].ImgName)
         }
         setfoundImages(temp)
      }

      // Person and Event and Date and location
      if (
         Person != null &&
         imgEvent != '' &&
         imgDate != '' &&
         imgLat != 0 &&
         imgLong != 0
      ) {
         for (let i = 0; i < data.length; i++) {
            var lat1 = data[i].Latitude
            var long1 = data[i].Longitude
            debugger
            var dis = await getDistance(
               {latitude: lat1, longitude: long1},
               {latitude: imgLat, longitude: imgLong},
            )
            if (dis <= 1000) {
               FindImages.push(data[i])
            }
         }
         setchecked(true)
         let temp1 = []
         debugger
         for (let i = 0; i < FindImages.length; i++) {
            if (
               FindImages[i].Person.trim() == Person.trim() &&
               FindImages[i].Event.trim() == imgEvent.trim() &&
               FindImages[i].Date == imgDate
            ) {
               temp1.push(FindImages[i])
            }
         }
         let temp = []
         debugger
         for (let i = 0; i < temp1.length; i++) {
            temp.push(temp1[i].ImgName)
         }
         setfoundImages(temp)
      }
   }

   const InsertIntoInputText = async () => {
      setShowDia((showDia = false))
   }

   return (
      <View style={styles.container1}>
         <ScrollView style={{flex: 2}}>
            <View style={{flexx: 2}}>
               <KeyboardAvoidingView
                  behavior="padding"
                  style={{flex: 1, justifyContent: 'space-between'}}>
                  <Text style={styles.titletxt}>CALLING SLIDESHOW</Text>

                  <TextInput
                     placeholder="Name"
                     onChangeText={Person => setPerson(Person)}
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
                        setImgDate(imgDate)
                     }}
                  />

                  <View style={{flexDirection: 'row', flex: 1}}>
                     <View style={{flexDirection: 'column'}}>
                        <Text style={styles.heading}>Place</Text>
                     </View>

                     <View
                        style={{flexDirection: 'column', alignItems: 'center'}}>
                        <TouchableOpacity
                           onPress={_showDia => setShowDia((showDia = true))}>
                           <Appbar.Action
                              style={{backgroundColor: '#F7D8D1'}}
                              icon="plus"
                              color={'black'}
                           />
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View style={{flexDirection: 'row', flex: 1}}>
                     <View style={{flexDirection: 'column'}}>
                        <Text style={styles.heading}>Latitude:</Text>
                     </View>

                     <View
                        style={{flexDirection: 'column', alignItems: 'center'}}>
                        <TextInput
                           placeholder="Latitude"
                           editable={false}
                           multiline={true}
                           value={imgLat.toString()}
                           style={[styles.inText]}
                        />
                     </View>
                  </View>

                  <View style={{flexDirection: 'row', flex: 1}}>
                     <View style={{flexDirection: 'column'}}>
                        <Text style={styles.heading}>Longitude:</Text>
                     </View>

                     <View
                        style={{flexDirection: 'column', alignItems: 'center'}}>
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
               <TouchableOpacity style={styles.button} onPress={getEvent}>
                  <Text>Trigger SlideShow</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>

         {/*  MOdal for Map */}
         <Modal visible={showDia}>
            <View style={{flex: 1}}>
               <GooglePlacesAutocomplete
                  placeholder="Search"
                  fetchDetails={true}
                  GooglePlacesSearchQuery={{
                     rankby: 'distance',
                  }}
                  // animate to region
                  onPress={(_data, details = null) => {
                     setPin({
                        coordinate: {
                           latitude: details.geometry.location.lat,
                           longitude: details.geometry.location.lng,
                        },
                     })
                     setImgLat(details.geometry.location.lat)
                     setImgLong(details.geometry.location.lng)
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
                     listView: {backgroundColor: 'white'},
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
                  style={[styles.map, {marginBottom: marg, marginTop: 40}]}
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
                     )
                     setImgLat(e.nativeEvent.coordinate.latitude)
                     setImgLong(e.nativeEvent.coordinate.longitude)
                  }}
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
   )
}

const styles = StyleSheet.create({
   titletxt: {
      padding: 10,
      fontSize: 20,
      marginBottom: 40,
      alignSelf: 'center',
      marginTop: 40,
      fontStyle: 'normal',
      fontWeight: 'bold',
      backgroundColor: 'white',
      borderRadius: 10,
   },
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
      // width: Dimensions.get("window").width,
      // height: Dimensions.get("window").height
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
})
