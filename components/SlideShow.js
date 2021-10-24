import React, { useEffect, useState } from 'react';

import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

import { SliderBox } from "react-native-image-slider-box";

export default function SlideShow({ route, navigation }) {

  const [img, setimg] = useState(route.params.fArray)

  useEffect(() => {
    console.log("Images: ", img)
  }, [img])

  return (
    <View >
      <SliderBox
        images={img}
        alignItems='center'
        marginTop={10}
        width={390}
        height={500}
        sliderBoxHeight={400}
        onCurrentImagePressed={index =>
          console.warn(`image ${index} pressed`)
        }
        autoplay
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Main')}
      >
        <Text>Done</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: "#D77660",
    padding: 10,
    margin: 20,
    borderRadius: 10
  },
});