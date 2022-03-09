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

        <View style={styles.body}>

          <Text style={styles.title}> VIEW FRIENDS FOLLOWERS </Text>

 

      <FlatList

        data = {this.state.friendsData}

        renderItem={({item}) => (

      <View>

   

      <Text style={{height:130, width: 250, backgroundColor: '#858713', color: 'white', marginTop: 50, marginLeft: 75, fontSize: 22}}>

        USER FRIENDS:  {item.user_givenname} {item.user_familyname} {item.user_email} {item.friend_count}

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

title: {

  color: '#a8a819',

  fontSize: 22,

  marginTop: 70,

  marginLeft: 40,

  fontWeight: 'bold',

  textAlign: 'center',

  borderWidth:  3,  

  borderColor: '#e3e327',

  backgroundColor:  '#0e8269',

  width: 350,

  height: 50,

  borderRadius: 10,

},

});

 

export default Followers;