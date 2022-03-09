import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet,TouchableOpacity, TextInput, navigate, navigation
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
            token: "",
            query:""
        }
    };
    getData = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id');
        
        return fetch("http://localhost:3333/api/1.0.0/search?search_in=friends&q=", {
              headers: {
                'X-Authorization':  token
              },
              method: 'GET',
            })
            .then((response) => {
                if(response.status === 200){
                   // this.setState({ friendData: response.data });
                   return response.json()
                }else if(response.status === 400){
                  console.log("Error")
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



    render(){
        return (
        
            <View style={styles.background}>
            <Text style= {styles.title}> SPACEBOOK </Text>
            <Text  style ={styles.profileTitle} >Search for Friends</Text>
                           
            <TextInput placeholder = 'Search for friends' 
            style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
            marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
            value={this.state.query} onChangeText={value => this.setState({query: value})}/>
             

            <TouchableOpacity>
            <Text onPress={() => this.getData()}> Search </Text>
            </TouchableOpacity> 
            <FlatList
            data = {this.state.friendsData}
            renderItem={({item}) => (
            <View>
                <Text style={{height:20, backgroundColor: '#fafa75', color: 'black' }}> User Name: {item.user_givenname} {item.user_familyname} </Text>
                
                <TouchableOpacity>
                    <Text onPress={() => this.props.navigation.navigate('FriendsProfilePage', {user_id: item.user_id} )} > View Profile </Text>
                </TouchableOpacity>



                <TouchableOpacity>
          <Text onPress={() => this.props.navigation.navigate('FreindsFollowers' , {user_id: item.user_id})} style={styles.post} > Followers </Text>
        </TouchableOpacity> 
                </View>
                
                )}
                keyExtractor={(item,index) => item.user_givenname}/>

            </View>
        );
      }
}
const styles = StyleSheet.create({
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