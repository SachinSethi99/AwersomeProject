import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet,TouchableOpacity,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendPages extends Component {

//get users info
//get users profile pic
//find frineds
//get list of posts for give user
//view single post
//update 
//delete post
//like post 
//remove post









    render(){
        return (
        
            <View style={styles.background}>
            <Text style= {styles.title}> SPACEBOOK </Text>
            <Text  style ={styles.profileTitle} >Search for Friends</Text>


{/*            
                <TextInput placeholder = 'Search for friends' 
                style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                  marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
                value={this.state.post} */}
                {/* /> */}

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