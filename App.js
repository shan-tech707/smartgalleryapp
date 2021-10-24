import React from 'react';
import { Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import SplashScreen from './components/SplashScreen';
import PicScreen from './components/PicScreen';
import AlbumScreen from './components/AlbumScreen';
import ImageDetails from './components/ImageDetails';
import MainScreen from './components/MainScreen';
import ImageView from './components/ImageView';
import SavedScreen from './components/SavedScreen';
import PicOnLocation from './components/PicOnLocation';
import DatabasePicture from './components/DatabasePicture';
import TriggerPicture from './components/TriggerPicture';
import AlbumPhotos from './components/AlbumPhotos';
import SearchScreen from './components/SearchScreen';
import SlideShow from './components/SlideShow';

const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={false}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AlbumPhotos"
          component={AlbumPhotos}
        />

        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
        />

        <Stack.Screen
          name="SlideShow"
          component={SlideShow}
        />

        <Stack.Screen
          name="Saved"
          component={SavedScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PicOnLocation"
          component={PicOnLocation}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ImgView"
          component={ImageView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ImageDetails"
          component={ImageDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Tab = createMaterialBottomTabNavigator();

const GalleryScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Picture"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: 'white' }}>
      <Tab.Screen
        name="Picture"
        component={PicScreen}
        options={{
          headerShown: false,
          tabBarLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require('./components/Pic/glogo1.jpg')
                  : require('./components/Pic/plogo.jpg')
              }
              style={{
                width: 35,
                height: 35,
                borderRadius: size,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Album"
        component={AlbumScreen}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require('./components/Pic/aalogo.png')
                  : require('./components/Pic/alogo.png')
              }
              style={{
                width: 35,
                height: 35,
                borderRadius: size,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="DatabasePicture"
        component={DatabasePicture}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require('./components/Pic/databaselogo2.png')
                  : require('./components/Pic/databaselogo.png')
              }
              style={{
                width: 35,
                height: 35,
                borderRadius: size,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TriggerPicture"
        component={TriggerPicture}
        options={{
          tabBarLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require('./components/Pic/cityIcon2.png')
                  : require('./components/Pic/cityIcon.png')
              }
              style={{
                width: 35,
                height: 35,
                borderRadius: size,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
