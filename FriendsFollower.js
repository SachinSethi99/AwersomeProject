import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
//imports used on friends follower page

class Followers extends Component { //friends follower page, where user views their friend's friends
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      friendsData: [],
      id: '',
      user_id: '',
    };
  }

  componentDidMount() { //checks user logged in and gets the data which gets updated functions
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
  }

  componentWillUnmount() { //closes the functions down when user is off the page
    this.unsubscribe();
  }

  checkLoggedIn = async () => { //checks if the user is logged in useing the session token, if logged out then user navigated to login page
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('LoginPage');
    }
  };
 

  getData = async () => { //get the friends
    const {user_id} = this.props.route.params; //gets user id of the your friends
     const token = await AsyncStorage.getItem('@session_token');
     return fetch("http://localhost:3333/api/1.0.0/user/"+ user_id + "/friends", {  //fetches the friend's friends 
         headers: {
           'Content-Type': 'application/json',
           'X-Authorization': token
         },
         method: 'GET',// Uses the POST method as the user wants to log in
       })
       .then((response) => {
        if(response.status === 200){ //responses if successfull and not 
            return response.json();
        }else if(response.status === 401){ 
          console.log("Friends can't be recived");
        }else if(response.status ===403){
          console.log("Can only view the friends of yourself or your friends")
        }else if(response.status ===404){
          console.log("Friends Not Found");
          
        }else if(response.status ===500){
          console.log("Server Error");
        }
        else{ //if response satus ain't found
            console.log("Something went wrong");
        }
    })
    .then((responseJson) => { //if successfull friends get stored in friends data array to be used in flatlist
      this.setState({
        isLoading: false,
        friendsData: responseJson
      });
    })
       .catch((error) => { //if no responses statisfed then error is printed
         console.log(error);
       });
   };

 

  render() { //rendering for the page
    if (this.state.isLoading){ //rendering for the friends friends page
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
    }else{ //displays the frineds
      return (

        <View style={styles.background}>
        <Text style= {styles.title}> SPACEBOOK </Text>
        <Text style={styles.profileTitle}> FRIENDS FOLLOWERS </Text>

 
        {/* a flat list that displays the frined of the friends and their full name and followers, the friend_count wasn't being accessed and casued an error and it didn't
        display it,  */}
      <FlatList 
        data = {this.state.friendsData}
        renderItem={({item}) => (
        <View  style={styles.container}>
        <Text style={styles.userName}>
        FRIEND:  {item.user_givenname} {item.user_familyname} 
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

const styles = StyleSheet.create({ //rendering of the friends friends the page
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
    color: "#fffcfa",
  },
  email: {
    height:30, 
    marginTop:0,
    marginLeft:2,
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