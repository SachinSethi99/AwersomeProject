import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

class requestfriends extends Component{
    constructor(props) {
        super(props);
        this.state = {
            followers: [],
            following: [],
            foundUser: [],
            search: "",
            profileImage: "",
            userid: "",
            useremail: "",
            username: "",
            name: "",
            followersNames: "",
            followingNames: "",
            token: ""
        }
    };
    render(){
        return( 
            <View style={styles.background}>
            <Text style= {styles.title}> SPACEBOOK </Text>
            <Text style={styles.profileTitle} > Request Friends </Text>

            </View>


        );
    

    }

}

const styles = StyleSheet.create({
    title:{
      fontSize:65,
      fontfamily:"lucida grande",
      color: "#fffcfa"
  },
    background : {
        backgroundColor: '#4267B2',
        flex : 1,
    },
    profileTitle:{
      fontSize:35,
      fontfamily:"lucida grande",
      color: "#fffcfa",
      marginLeft: 90
    }
});

export default requestfriends

