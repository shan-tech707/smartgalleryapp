import React from 'react';
import { View, StyleSheet, Dimensions, Text, Modal, Button, TouchableOpacity } from 'react-native';

import Gallery from 'react-native-image-gallery';
import { Appbar, TextInput } from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ImageView({ route, navigation }) {
  const { uri } = route.params;
  let [showDia, setShowDia] = React.useState(false);

  return (
    <View style={styles.container}>
      <Appbar.Header
        style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.navigate('Picture')} />

        <Appbar.Content title="Detail" onPress={() => navigation.navigate('Details', { uri: uri })}
          style={{ alignItems: 'flex-end' }} />
        <Appbar.Action
          icon="dots-vertical"
          onPress={(showDia) => setShowDia(showDia = true)}
        />
      </Appbar.Header>
      <Gallery
        images={[
          {
            source: { uri: uri },
            dimensions: { width: windowWidth, height: windowHeight },

          },
        ]}
      />
      {/* <Text style={{ fontSize: 40, justifyContent: 'center', textAlign: 'center' }}>Normal Text</Text>
      <Button title="Show Modal" onPress={(showDia) => setShowDia(showDia = true)} /> */}

      <Modal visible={showDia} transparent={true}>
        <View style={{ backgroundColor: '#000000aa', flex: 1, color: 'black' }}>
          <View style={styles.popUp}>

            {/* <Button title="Save" onPress={(showDia) => setShowDia({ showDia: false })} /> */}

            <TouchableOpacity style={styles.button}
              onPress={() => navigation.navigate('Details', { uri: uri })}>
              <Text style={{ fontSize: 20 }}> Detail </Text>

            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
              onPress={() => navigation.navigate('Gallery')}>
              <Text style={{ fontSize: 20 }}> Edit </Text>

            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  inputText: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,

  },
  popUp: {
    marginLeft: 200,
    marginRight: 30,
    marginBottom: 450,
    marginTop: 25,
    backgroundColor: '#ffffff',
    flex: 1,
    borderRadius: 8,
    padding: 10
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  appbar: {
    backgroundColor: 'transparent',
    color: 'white',
    justifyContent: 'flex-end',
    alignContent: 'space-between'
  },
});