import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet,TouchableOpacity, TextInput
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendPages extends Component {
    constructor(props) {
        super(props);
        /* set default placeholder values that we will set our data to */
        this.state = {
            followers: [],
            following: [],
            foundUser: [],
            search: "",
            profileImage: "",
            userid1: "",
            user_id:"",
            useremail: "",
            username: "",
            name: "",
            followersNames: "",
            followingNames: "",
            token: ""
        }
    };

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
        this.getData();
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }
    
      checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('Log In');
        }
      };



//get users info
//get users profile pic
//find frineds
//get list of posts for give user
//view single post
//update 
//delete post



//like post 
addLike = async() => {
    const id = await AsyncStorage.getItem('@session_id');
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch('http://localhost:3333/api/1.0.0/user/'+user_id+'/post/' + post_id+'/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token
      }
    })
      .then((response) => {
        this.getData();
        console.log("like deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  };


//remove like
removeLike = async() => {
    const id = await AsyncStorage.getItem('@session_id');
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch('http://localhost:3333/api/1.0.0/user/'+user_id+'/post/' + post_id+'/like', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token
      }
    })
      .then((response) => {
        this.getData();
        console.log("like deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  };









    render(){
        return (
        
            <View style={styles.background}>
            <Text style= {styles.title}> SPACEBOOK </Text>
            <Text  style ={styles.profileTitle} >Search for Friends</Text>



                
           
                <TextInput placeholder = 'Search for friends' 
                style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                  marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
               />
            

                <TouchableOpacity>
                 <Text> Search </Text>
                 </TouchableOpacity>
      






            </View>
        );
      }
}
const styles = StyleSheet.create({
background : {
    backgroundColor: '#4267B2',
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
    marginLeft: 90
  },
  profileTitle2:{
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginLeft: 10


  },

});
export default FriendPages