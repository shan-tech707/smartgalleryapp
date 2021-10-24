import React, { useState } from 'react';
import {
  View, Text, FlatList, Dimensions, TextInput, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import { RadioButton, Appbar } from 'react-native-paper';

import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'DTMLane.db', createFromLocation: 1 })

const windowWidth = Dimensions.get('window').width;
const columns = 4;

export default function SearchScreen({ navigation }) {
  let [inputSearch, setInputSearch] = useState('');
  let [userData, setUserData] = useState([]);

  const [rbChecked, setrbChecked] = React.useState('Person');

  let searchUser = () => {
    console.log(inputSearch);
    db.transaction((tx) => {
      if (rbChecked === 'Person') {
        tx.executeSql(
          'SELECT * FROM ImgData where Person = ?',
          [inputSearch],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setUserData(temp);
          },
        );
      }

      if (rbChecked === 'Event') {
        tx.executeSql(
          'SELECT * FROM ImgData where Event = ?',
          [inputSearch],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setUserData(temp);
          },
        );
      }

      if (rbChecked === 'Place') {
        tx.executeSql(
          'SELECT * FROM ImgData where City = ?',
          [inputSearch],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setUserData(temp);
          },
        );
      }

      if (rbChecked === 'Date') {
        tx.executeSql(
          'SELECT * FROM ImgData where Date = ?',
          [inputSearch],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setUserData(temp);
          },
        );
      }


    });
  };


  return (
    <View>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.navigate("Saved")} color={'white'} />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          onChangeText={(inputSearch) => setInputSearch(inputSearch)}
          placeholderTextColor="#7F7F7F"
        />
        <Appbar.Action
          icon="magnify"
          color={'white'}
          onPress={searchUser}
        />
      </Appbar.Header>
      <Appbar.Header style={{ backgroundColor: 'white' }}>
        <RadioButton
          value="Person"
          status={rbChecked === 'Person' ? 'checked' : 'unchecked'}
          onPress={() => setrbChecked('Person')}
          color="#1AAB4B"
        />
        <Text style={styles.heading}>Person</Text>

        <RadioButton
          value="Event"
          status={rbChecked === 'Event' ? 'checked' : 'unchecked'}
          onPress={() => setrbChecked('Event')}
          color="#1AAB4B"
        />
        <Text style={styles.heading}>Event</Text>

        <RadioButton
          value="Place"
          status={rbChecked === 'Place' ? 'checked' : 'unchecked'}
          onPress={() => setrbChecked('Place')}
          color="#1AAB4B"
        />
        <Text style={styles.heading}>City</Text>

        <RadioButton
          style={{ width: 2 }}
          value="Date"
          status={rbChecked === 'Date' ? 'checked' : 'unchecked'}
          onPress={() => setrbChecked('Date')}
          color="#1AAB4B"
        />
        <Text style={styles.heading}>Date</Text>
      </Appbar.Header>

      <FlatList
        data={userData}
        numColumns={columns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ImageDetails', { uri: item.ImgName })
            }>
            <Image
              style={styles.itemContext}
              source={{
                uri: item.ImgName,
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  appbar: {
    backgroundColor: '#212121',
  },
  input: {
    flex: 1,
    color: 'white',
    backgroundColor: '#212121',
    fontSize: 16,
  },
  itemContext: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    width: windowWidth / columns,
    height: windowWidth / columns,
  },
  heading: {
    fontSize: 16,
    width: 65,
    fontWeight: 'normal',
    alignSelf: 'center'
  },
});
