import React, {Component} from 'react';

import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { FlatList } from 'react-native-gesture-handler';


 

class Followers extends Component {

  constructor(props){

    super(props);

    this.state = {

      isLoading: true,

      friendsData: [],

      id: '',

      user_id: '',

    }

  }

 

  componentDidMount() {

    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this.checkLoggedIn();

    });

    this.getData();

  }

 

  componentWillUnmount() {

    this.unsubscribe();

  }

 

  getData = async () => {

    const {user_id} = this.props.route.params;

    // const id = await AsyncStorage.getItem('@session_id');

     const token = await AsyncStorage.getItem('@session_token');

     return fetch("http://localhost:3333/api/1.0.0/user/"+ user_id + "/friends", {    

         headers: {

           'Content-Type': 'application/json',

           'X-Authorization': token

         },

         method: 'GET',// Uses the POST method as the user wants to log in

       })

       .then((response) => {

        if(response.status === 200){

            return response.json()

        }else if(response.status === 400){

          this.props.navigation.navigate("Log In");

        }else{

            throw 'Something went wrong';

        }

    })

    .then((responseJson) => {

      this.setState({

        isLoading: false,

        friendsData: responseJson

      })

    })

       .catch((error) => {

         console.log(error);

       })

   }

 

  checkLoggedIn = async () => {

    const value = await AsyncStorage.getItem('@session_token');

    if (value == null) {

        this.props.navigation.navigate('Log In');

    }

  };

 

  render() {

    if (this.state.isLoading){

      return (

        <View

          style={{

            flex: 1,

            flexDirection: 'column',

            justifyContent: 'center',

            alignItems: 'center',

            height: 200,

            width: 100,

          }}>

          </View>

      );

    }else{

      return (

        <View style={styles.background}>
        <Text style= {styles.title}> SPACEBOOK </Text>
        <Text style={styles.profileTitle}> FRIENDS FOLLOWERS </Text>

 

      <FlatList
        data = {this.state.friendsData}
        renderItem={({item}) => (
      <View  style={styles.container}>

      <Text style={styles.userName}>
        FRIEND:  {item.user_givenname} {item.user_familyname} {item.user_email} 
      </Text>

      <Text style={styles.email}>
        EMAIL: {item.user_email} 
      </Text>

        </View>

        )}

          keyExtractor={(item,index) => item.user_givenname}/>

        </View>

 

      );

     }

    }

  }

 

const styles = StyleSheet.create({

  body: {

    backgroundColor: '#800000',
  flex:  1,

  display: 'flex',

},

background : {
  backgroundColor: '#800000',
    flex : 1,
},
title:{
  fontSize:65,
  fontfamily:"lucida grande",
  color: "#fffcfa"
},
profileTitle:{
  fontSize:35,
  fontfamily:"lucida grande",
  color: "#fffcfa",
  marginLeft: 25
},
userName: {
  height:30, 
  marginTop:5,
  marginLeft:2,
  //marginRight:10,
  color: "#fffcfa",
},
email: {
  height:30, 
  marginTop:0,
  marginLeft:2,
  //marginRight:10,
  color: "#fffcfa",
},
container:{
  borderColor:"#fffcfa",
  borderWidth:3.5,
  marginTop:10,
  marginBottom:5,
  marginLeft:10,
  marginRight:10
},

});

 

export default Followers;