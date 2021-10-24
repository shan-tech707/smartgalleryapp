import React, { useState, useEffect } from 'react';
import {
    FlatList, View, StyleSheet, Image, Dimensions,
} from 'react-native';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'DTMLane.db', createFromLocation: 1 })
const windowWidth = Dimensions.get('window').width;
const columns = 4;


const DatabasePicture = ({ navigation }) => {

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
});

export default DatabasePicture;