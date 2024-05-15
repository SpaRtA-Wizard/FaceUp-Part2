import React, { useState, useEffect, useRef  } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import _FontAwesome from "react-native-vector-icons/FontAwesome";
import { addPhoto } from '../reducers/user';
import { useDispatch } from 'react-redux';


export default function SnapScreen() {
  const dispatch = useDispatch();

  const [facing, setFacing] = useState("back");
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const FontAwesome = _FontAwesome as React.ElementType;


  let cameraRef: any = useRef(null);

  if (!permission) {
    return <View />;
  }

  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
    dispatch(addPhoto(photo.uri));
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={(ref) => cameraRef = ref} enableTorch={torch}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setFacing((current) => (current === "back" ? "front" : "back"))}>
            <FontAwesome name="rotate-right" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => cameraRef && takePicture()}>
            <FontAwesome name= "circle-thin" size={75} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setTorch(() => (!torch))}>
            <FontAwesome name="flash" size={25} color={!torch ? '#ffffff' : '#e8be4b'}/>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    margin: 64
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white"
  }
});
