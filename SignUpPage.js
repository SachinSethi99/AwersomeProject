/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, TouchableOpacity,
} from 'react-native';

class SignUpPage extends Component { // sign up page where user enter their details to create an account
  // props declared
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    };
  }

  SignUp = () => {
    const to_Send = { // perameters assigned to the props,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
    };

    return fetch('http://localhost:3333/api/1.0.0/user', { // the user details posted to the server
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(to_Send), // strings the parameters
    })
      .then((response) => {
        // responses if sucessful and unsucessful
        if (response.status === 201) {
          this.props.navigation.navigate('LoginPage');
        } else if (response.status === 400) {
          console.log('Email and password already used before or both email password are invlaid');
        } else if (response.status ===500){
          console.log("Server Error");
        }
        else {  
           console.log('Error Crash, unable to commute');
        }
      }).catch((error) => {
        console.log(error);
      });
  };// connect to the API, get the token on the website, I can see it

  render() {
    return (
    // display the titles, pass in the details to create an account
      <View style={styles.background}>
        <Text style={styles.title}> SPACEBOOK </Text>

        <Text style={styles.details}>ENTER DETAILS</Text>
        <TextInput
          placeholder="FIRST NAME"
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
          onChangeText={(value) => this.setState({ first_name: value })}
          value={this.state.first_name}
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
          secureTextEntry
          onChangeText={(value) => this.setState({ password: value })}
          value={this.state.password}
        />

        <TouchableOpacity>
          <Text onPress={() => this.SignUp()} style={styles.createAccount}> CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
// style sheet for the signup page
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

  details: {
    marginTop: 200,
    marginLeft: 140,
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',

  },

  createAccount: {
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
    marginTop: 10,
    marginLeft: 120,

  },
});

export default SignUpPage;
