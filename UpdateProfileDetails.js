import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cameraIcon from './assets/cameraIcon.png';

class editProfileDetails extends Component {
  constructor(props) {
    //props created, new props added to update old fields
    super(props);
    this.state = {
      isLoading: true, 
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      new_first_name: '',
      new_last_name: '',
      new_email: '',
    };
  }

  updateDetails = async () => {//function to update the user details
    //placeholder to update the details
    const to_Send = {};
    //if statements to check if the details are not the same
    if (this.state.first_name != this.state.new_first_name) {
      to_Send.first_name = this.state.first_name;
    }

    if (this.state.last_name != this.state.new_last_name) {
      to_Send.last_name = this.state.last_name;
    }

    if (this.state.email != this.state.new_email) {
      to_Send.email = this.state.email;
    }

    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');
    //user details patched in async storage
    return fetch("http://localhost:3333/api/1.0.0/user/"+id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(to_Send), 
      //respones checked, responses added 
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('LoginPage'); //if details successful then user has to enter their details again
        } else if(response.status ===400){
            console.log("Bad Request");
        }
        else if (response.status === 401) {
            console.log("Unauthorised");
        } 
        else if (response.status === 403) {
            console.log("Forbidden");
        } 
        else if (response.status === 404) {
            console.log("Not Found");
        } 
        else if (response.status === 500) {
            console.log("Server Error");
        } 
        else {
          throw 'Error Crash, unable to commute';
        }
      }).catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
        //styling for the page
        <View style={styles.background}>
        <Text style={styles.title}> SPACEBOOK </Text>
        <Text style={styles.details}>UPDATE DETAILS </Text>
        
        <TextInput //inputs where the user pass their information
        placeholder="FIRST NAME" style={{    
            fontSize: 25,
            backgroundColor: '#ffffff',
            textAlign: 'center',
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBottom: 0,
            borderWidth: 2,}} 
            onChangeText={(value) => this.setState({ first_name: value })} value={this.state.first_name}
        />

        <TextInput
          placeholder="SECOND NAME"
          style={{
            fontSize: 25,
            backgroundColor: '#ffffff',
            textAlign: 'center',
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBottom: 0,
            borderWidth: 2,
          }}
          onChangeText={(value) => this.setState({ last_name: value })}
          value={this.state.last_name}
        />

        <TextInput
          placeholder="EMAIL ADDRESS"
          style={{
            fontSize: 25,
            backgroundColor: '#ffffff',
            textAlign: 'center',
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBottom: 10,
            borderWidth: 2,
          }}
          onChangeText={(value) => this.setState({ email: value })}
          value={this.state.email}
        />
        {/*Camera icon*/}
        <img src= {cameraIcon} style={{width:100, height:80 , marginLeft:145}}/>
        {/* access to the camera for the user can change Image */}
        <TouchableOpacity> 
                 <Text onPress={() => this.props.navigation.navigate('CameraPage')} style={styles.cameraText}> CHANGE PROFILE PICTURE</Text>
        </TouchableOpacity>
        
        {/* user updates their details */}
        <TouchableOpacity>
          <Text onPress={() => this.updateDetails()} style={styles.updateAccount}> UPDATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  background: {
    backgroundColor: '#800000',
    flex: 1,
  },
  title: {
    fontSize: 65,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
  },
  cameraText:{
    marginTop: 10,
    marginLeft: 10,
    marginRight:10,
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
    backgroundColor: '#DAA520',
    fontWeight: 'bold',
    borderWidth:  0, 
    textAlign: 'center',
    borderColor:"#fffcfa"
  },

  details: {
    marginTop: 200,
    marginLeft: 130,
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',

  },

  updateAccount: {
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
    marginTop: 10,
    marginLeft: 10,
    marginRight:10,
    backgroundColor: '#8FBC8F',
    fontWeight: 'bold',
    borderWidth:  0, 
    textAlign: 'center',
    borderColor:"#fffcfa"
  },

});
export default editProfileDetails;
