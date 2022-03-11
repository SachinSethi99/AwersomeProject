/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CameraPage extends Component { // Camera class for user to take the image
  constructor(props) {
    // props used for the camaera clas
    super(props);
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back, // access to back camera of the device,
    };
  }

  async componentDidMount() { // checks the status of the camera permission
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  takePicture = async () => { // function to take the picture
    if (this.camera) {
      const options = {  // sets the values to the camera and sends the image to the sever
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options); // image stored in async storage
    }
  };

  sendToServer = async (data) => {// image sent to server
    // values obtained from asyncstorage and stored methods
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    const res = await fetch(data.base64);
    const blob = await res.blob();

    // image sent to the server under the user id
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png', // passing in a image
        'X-Authorization': token,
      },
      body: blob,
    })
      .then((response) => { // responses added depending if the image added to the server is successful
        if(response.status ===200){
          console.log("Picture added", response);
        }else if (response.status ===400){
          console.log("Bad Request")
        }else if(response.status === 401){
          console.log("Image cannot be added")
        }else if (response.status ===404){
          console.log("Image not found")
        }else if (response.status ===500){
          console.log("Sever Error")
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.hasPermission) { // check if the permission is granted before user can access the iamge
      return (
        <Camera // camaera is diplayed on the screen
          style={styles.camera}
          type={this.state.type}
          ref={(ref) => this.camera = ref}
        >
          {/* the button is created for the user to take an image  */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.takePicture();
              }}
            >
              <Text style={styles.text}> Take Picture</Text>
            </TouchableOpacity>
          </View>
        </Camera>

      );
    }
    else{
      // if no access is granted then this text will display, however sometime does display if access granted, a glitch in the system because it ins't quick enough
      // permison has been granted

      return (
      <Text>No access to camera</Text>
      );
    }
  }
}

// stylesheet for the camera
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    marginLeft: 295,
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
  },
});

export default CameraPage;
