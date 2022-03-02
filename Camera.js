import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

class CameraPage extends Component{
    constructor(props){
      super(props);
  
      this.state = {
        hasPermission: null,
        type: Camera.Constants.Type.back
      }
    }

    async componentDidMount(){
        const { status } = await Camera.requestCameraPermissionsAsync();
        this.setState({hasPermission: status === 'granted'});
      }


      takePicture = async() =>{
        if(this.camera){
          const options = {
            quality:0.5, 
            base64:true,
            onPictureSaved: (data) => this.sendToServer(data)        
          }
          await this.camera.takePictureAsync(options);
          console.log(data.uri);
        }
      }
  
  
      sendToServer =async(data) =>{
        const id = await AsyncStorage.getItem('@session_id');
        const token = await AsyncStorage.getItem('@session_token');
  
        let res = await fetch(data.base64);
        let blob = await res.blob;
  
        return fetch("http://localhost:3333/api/1.0.0/user/user/" + id +"/photo",{
          method: "POST",
          headers:{
            'Content-Type': 'image/png',
            'X-Authorization': token
          },
          body: blob
        })
        .then((response)=> {
          console.log("Picture added", response);
        })
        .catch((error)=> {
          console.log(error);
        })
      }

      render(){
      if(this.state.hasPermission){
        return(
                <Camera
                style={styles.camera}
                type={this.state.type}
                ref ={ref => this.camera =ref}
                > 
                <View style = {styles.buttonContainer}>
                <TouchableOpacity
                style = {styles.button}
                onPress= {() =>{
                  this.takePicture();
                }}>
                
                <Text  style={styles.text}> Take Picture</Text>
                </TouchableOpacity>
                </View>
               </Camera> 

        
         
        );
      }else{
        return(
          <Text>No access to camera</Text>
        );
      }
    }
  }
  
  
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
      fontSize: 18,
      color: 'white',
    },
  });










export default CameraPage
  