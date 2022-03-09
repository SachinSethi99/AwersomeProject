import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginPage extends Component { // login pager where the user enter their details and log in
  // props declared and ininialised
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      id: '',
      email: 'sachinsethi1999@gmail.com',
      password: 'sachinsethi',
    };
  }

  // login method, posts the login to the server and navigates to the profile page
  Login = async () => fetch('http://localhost:3333/api/1.0.0/login', { // query to sent to the sever
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(this.state),
  })
  // respones
    .then((response) => {
      // response 200 if user details correct, response is returned, any other response is because of the wrong details or sever
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        console.log('Invalid email or password');
      } else if(response.status === 500){
        console.log("Server Error");
      }
      else {
        throw 'Server Error';
      }
    })
    .then(async (responseJson) => {
      // set the user details stored in AsyncStorage, navigted to the profile page
      console.log(responseJson);
      await AsyncStorage.setItem('@session_id', responseJson.id);
      await AsyncStorage.setItem('@session_token', responseJson.token);
      this.props.navigation.navigate('ProfilePage');
    })
    .catch((error) => {
      // any other error gets caught and printed
      console.log(error);
    });

  // render the login page
  render() {
    return (
    // Display the background and the details
      <View style={styles.background}>
        <Text style={styles.title}> SPACEBOOK </Text>
        <Text style={styles.login}>PLEASE LOGIN BELOW</Text>

        <TextInput // Pass in user details to login
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

        <TextInput
          placeholder="PASSWORD"
          style={{
            fontSize: 25,
            backgroundColor: '#ffffff',
            textAlign: 'center',
            marginLeft: 10,
            marginRight: 10,
            marginTop: 0,
            marginBottom: 0,
            borderWidth: 2,
          }}
          onChangeText={(value) => this.setState({ password: value })}
          secureTextEntry
          value={this.state.password}
        />

        <TouchableOpacity>
          <Text onPress={() => this.Login()} style={styles.signIn}> SIGIN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text onPress={() => this.props.navigation.navigate('SignUpPage')} style={styles.signUp}> SIGN UP</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
// Style sheet for design
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

  login: {
    marginTop: 200,
    marginLeft: 110,
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',

  },

  signIn: {
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
    marginTop: 10,
    marginLeft: 155,

  },
  signUp: {
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
    marginTop: 5,
    marginLeft: 155,

  },
});
export default LoginPage;
