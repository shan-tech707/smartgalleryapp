import React, { useEffect, useState } from 'react';
import {
  View, Dimensions, Text, StyleSheet, Image, FlatList,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import EvilIcon from 'react-native-vector-icons/AntDesign';
import CameraRoll from '@react-native-community/cameraroll';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

let URIARRAY = [];
const windowWidth = Dimensions.get('window').width;

const AlbumScreen = ({ navigation }) => {
  const [albums, setAlbums] = useState([]);

  const getAlbum = () => {
    CameraRoll.getAlbums({
      assetType: 'Photos',
      groupTypes: 'All',
    }).then(r => {
      setAlbums(r);
      r.forEach(obj => {
        if (obj.title == obj.title) {
          let x = GetAlbumsPhotos(obj.title);
        }
      });
    });
  };

  useEffect(() => {
    getAlbum();
  }, []);

  const GetAlbumsPhotos = async Title => {
    await CameraRoll.getPhotos({
      first: 1,
      groupName: Title,
    }).then(r => {
      let URI = r.edges.map(rc => (rc.node.image.uri = rc.node.image.uri));

      URIARRAY.push({ URI, Title });
      return URI;
    });
  };

  const Return_URIOFEVERYALBUMSFIRSTPHOTO = title => {
    let obj = URIARRAY.filter(o => o.Title === title);
    let AlbumsTitle = obj.map(rc => (rc.URI = rc.URI));
    let q = AlbumsTitle[0] + '';
    return q;
  };

  renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate('AlbumPhotos', {
          Count: item.count,
          Title: item.title,
        })
      }>
      <View>
        <View style={styles.mycard}>
          <Image
            style={{
              width: 60,
              height: 60,
              marginHorizontal: 30,
              justifyContent: 'center',
            }}
            source={{ uri: Return_URIOFEVERYALBUMSFIRSTPHOTO(item.title) }}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ color: 'black', opacity: 1, fontSize: 17 }}>
              {item.title}
            </Text>
            <Text style={{ color: 'silver', opacity: 1, fontSize: 15 }}>
              {item.count}
            </Text>
          </View>

          <EvilIcon
            name="right"
            size={20}
            style={{
              justifyContent: 'center',
              opacity: 0.5,
              marginLeft: windowWidth - 25, //chnage here
              position: 'absolute',
            }}
          />
        </View>
        <View style={styles.border1}></View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={{ backgroundColor: '#F5F5F5', height: '100%' }}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction color={'white'} />
        <Appbar.Content title="Photo Albums" color={'white'} />
        <Appbar.Action
          icon="dots-vertical"
          color={'white'}
        />
      </Appbar.Header>
      <FlatList
        data={albums}
        renderItem={item => renderItem(item)}
        keyExtractor={item => item.title.toString()}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  mycard: {
    marginTop: 5,
    flexDirection: 'row',
    height: 100,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  appbar: {
    backgroundColor: '#212121',
  },
  border1: {
    borderBottomWidth: 0.5,
    opacity: 0.2,
    marginRight: '5%',
    marginLeft: '5%',
  },
});

export default AlbumScreen;
