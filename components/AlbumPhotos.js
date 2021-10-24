import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, FlatList, Dimensions } from 'react-native';
import { Appbar } from 'react-native-paper';
import CameraRoll from '@react-native-community/cameraroll';

const windowWidth = Dimensions.get('window').width;
const columns = 4;

const AlbumsPhoto = ({ route, navigation }) => {
  const [albumsPhotos, setPhotos] = useState([]);
  const { Count, Title } = route.params;

  const getAlbumPhotos = async () => {
    console.log(Title);
    console.log(Count);

    await CameraRoll.getPhotos({
      first: Count,
      assetType: 'Photos',
      groupName: Title,
    }).then(r => {
      setPhotos(r.edges);
    });
  };
  useEffect(() => {
    getAlbumPhotos();
  }, []);

  const _handleMore = () => { };
  const _goBack = () => {
    navigation.replace('BottomTabs');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={_goBack} color={'white'} />
        <Appbar.Content title={Title} color={'white'} />
        <Appbar.Action
          icon="dots-vertical"
          onPress={_handleMore}
          color={'white'}
        />
      </Appbar.Header>
      <FlatList
        data={albumsPhotos}
        numColumns={columns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ImageDetails', { uri: item.node.image.uri })
            }>
            <Image
              style={styles.itemContext}
              source={{
                uri: item.node.image.uri,
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
export default AlbumsPhoto;

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
  input: {
    flex: 1,
    color: 'white',
    backgroundColor: '#212121',
    fontSize: 16,
  },
});
