// USE: https://docs.expo.dev/versions/latest/sdk/camera/ 
// documentation for using expo-camera

import Ionicons from '@expo/vector-icons/Ionicons';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [images, setImages] = useState<string[]>([]);
  
  const cameraRef = React.useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      photo && setImages([...images, photo.uri]);
    }
  }
  

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={48} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={48} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}  onPress={() => setImages([])}>
            <Ionicons name="trash-outline" size={48} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={ async() => {
            const imgurImages = await Promise.all(
              images.map(async (image, index) => {
                try {
                  const formData = new FormData();
                  const localFile = {
                    uri: image,
                    name: `image${index + 1}.jpg`,
                    type: 'image/jpeg',
                  }
                  formData.append('image', localFile as any);
                  formData.append('type', 'file');
                  formData.append('title', `Image ${index + 1}`);
                  formData.append('description', `Description ${index + 1}`);
                  
                  return await fetch("https://api.imgur.com/3/image", {
                    method: "POST",
                    headers: {
                      Authorization: `Client-ID ${process.env.EXPO_PUBLIC_IMGUR_CLIENT_ID}`
                    },
                    body: formData,
                  }).then((response) => {return response.json()})
                    .then((data) => data.data.link)
                } catch (error) {
                  console.log('Error reading image:', error);
                  return null;
                }
              })
            );
            
            images.length > 0 && router.push(`../menu?imageList=${imgurImages.join(",")}`)}}>
            <Ionicons name="checkmark-outline" size={48} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', overflow: 'scroll', position: 'absolute', bottom: 50}}>
          {images.map((image, index) => (
            <View key={index} style={{ borderColor: 'white', borderWidth: 1}} onTouchEnd={
              () => router.push({ pathname: '/image', params: { uri: image, imageList: images} })}>
              <Image source={{ uri: image }} style={{ width: 100, height: 100 }}></Image>
            </View>
          ))}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingLeft: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
