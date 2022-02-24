import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

class friendsPage extends Component {
    //get list of friends
    //add new friends
    //list of friend requests + accept and decline 
    //search for friends 
    
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
            <Text style={styles.profileTitle} > Friends Page </Text>
           
            <TextInput placeholder = 'Find Friend' 
                style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
                />
           
           
           
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

export default friendsPage