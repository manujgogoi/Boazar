/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PROFILE_URL} from '../../utils/urls';
import axiosInstance from '../../services/Axios';

const ProfilePhotoScreen = ({route, navigation}) => {
  const {profile} = route.params;
  const [photo, setPhoto] = useState(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  // ==================================================
  // Event handlers
  // ==================================================
  const handleChoosePhoto = () => {
    const options = {
      quality: 0.1,
    };
    launchImageLibrary(options, response => {
      if (response?.assets) {
        setPhoto(response.assets[0]);
        setReady(true);
      } else {
        console.log('Image not selected');
        setReady(false);
      }
    });
  };

  const handleUploadPhoto = () => {
    const image_url = photo;
    console.log(profile);
    console.log(photo);

    const fd = new FormData();
    fd.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });

    // Axios call
    axiosInstance
      .patch(profile.url, fd, {
        headers: {
          'content-type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          console.log(
            'Upload Progress: ' +
              Math.round((progressEvent.loaded / progressEvent.total) * 100) +
              '%',
          );
          setProgress(
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
              '%',
          );
        },
      })
      .then(res => {
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Profile Photo</Text>
      {photo && (
        <Image source={{uri: photo.uri}} style={{width: 250, height: 300}} />
      )}
      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Select Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleUploadPhoto}
        disabled={!ready}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#00e6ac',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
  },
  buttonText: {
    fontSize: 18,
  },
});

export default ProfilePhotoScreen;
