import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
//imports used for this friend request page
class followerPage extends Component {  //this page is where user can review any outstanding friends that they have accpeted them 
  //props declared to be used for this page
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      friendData: [],
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      user_id: '',
    }
  };
    
  componentDidMount() { //checks and the runs the fucntions, checks if user is logged in and updated the data on the page 
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
  }

  componentWillUnmount() { //closed functions when user is off the page
    this.unsubscribe();
  }

  checkLoggedIn = async () => { //checks if the user is logged in by checking their session token is active
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('LoginPage');
    }
  };

  getData = async () => { //get the data of the friends reuqest for the user
    const token = await AsyncStorage.getItem('@session_token'); //get the token to if the user is acitve on their account
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', { //the url to get the friends request of their account
      headers: {
        'X-Authorization':  token
      },
      method: 'GET',
    })
      .then((response) => { //responses are checked with the stauts
        if(response.status === 200){ //if response gets the friend then friends get returned
          return response.json()
        }else if(response.status === 401){ //if responses are not successful then the console will print the issue
          console.log("Unauthorised, perhaps there is no frineds");
        }else if(response.status === 500){
          console.log("Server Issues");
        }    
        else{ //errors outside the responses will log to console something went wrong
          console.log("Something went wrong");
        }
      })
      .then((responseJson) => { //the returned response gets stored in the friends data array so it can view all the friends requests
        this.setState({
          isLoading: false,
          friendsData: responseJson
        })
      })
      .catch((error) => {//if everything has failed then an error will be printed
        console.log(error);
      })
  }

  acceptRequest = async(user_id) => { //accpets the friends requst, get the id from the person who sent the request
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests/'+user_id, { //the url to accpect the friend request, it gets posted to the server
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      method: 'POST',
    })
      .then((response) => { //responses if accptance is sucessful then it will its accpted, else it will print the other issue 
        if(response.status === 200){
          console.log("Accpeted Request");
        }else if(response.status === 401){
          console.log("Not Accpted");
        }else if(response.status === 404){
          console.log("Friend not found");
        }else if(response.status === 500){
          console.log("Server Error");
        } else{ //prints something went wrong with repsonse status isn't equal to any of the above
          console.log("Something went wrong");
        }
      })
      .catch((error) => { //any other errors will print an error to console
        console.log(error)
      })
  }

  rejectRequest = async(user_id) => {//rejects the friends requst, get the id from the person who sent the request
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + user_id , {//the url to Delete the friend request, it gets posted to the server
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      method: 'DELETE',
    })
      .then(() => {
        if(response.status === 200){
          console.log("Follow Deleted");
        }else if(response.status === 401){
          console.log("Request not rejected");
        }else if(response.status === 404){
          console.log("Friend not found");
        }else if(response.status === 500){
          console.log("Server Error");
        }else{//prints something went wrong with repsonse status isn't equal to any of the above
          console.log("Something went wrong");
        }
      })
      .catch((error) => {//any other errors will print an error to console
        console.log(error)
      })
  }

  render() { //renders the friend request page
    if (this.state.isLoading) { //if loading is ture, it will display nothing as an error
      return (
                <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                >
                </View>
      );
    } else{
      return (      //rendering of the friends request page
              <View style={styles.background}>
              <Text style= {styles.title}> SPACEBOOK </Text>
              <Text style={styles.profileTitle}> RECIEVED REQUESTS  </Text>
             
              {/* Displays a flatlist of all the frineds request, also the container styling seperated the each request */}
              <FlatList
              data = {this.state.friendsData}
              renderItem={({item}) => (
              <View style={styles.container}>
                {/* friend reuqest name is displayed so the user know who sent it */}
                <Text style={styles.userName}> FRIEND REQUESTS BY: {item.first_name} {item.last_name}</Text>
                
                {/* the accpet and reject buttons for the friend request, once clicked the responese will be shown in the console */}
                <TouchableOpacity>
                  <Text onPress={() => this.acceptRequest(item.user_id)} style={styles.post} > ACCPETED </Text>
                </TouchableOpacity>
                
                <TouchableOpacity>
                  <Text onPress={() => this.rejectRequest(item.user_id)} style={styles.post1} > REJECTED  </Text>
                </TouchableOpacity>  
                
                </View>
                )}
                keyExtractor={(item,index) => item.user_givenname}
                />
              </View>
      );  
    }
  } 
}

const styles = StyleSheet.create({ //the stylesheet for viewing the friend reuqest page.
  title:{
    fontSize:65,
    fontfamily:'lucida grande',
    color: '#fffcfa'
  },
  background : {
    backgroundColor: '#800000',
    flex : 1,
  },
  profileTitle:{
    fontSize:35,
    fontfamily:'lucida grande',
    color: '#fffcfa',
    marginLeft: 20
  },

  post : {

    fontSize:20,
    fontfamily:'lucida grande',
    color: '#fffcfa',
    backgroundColor: '#8FBC8F',
    fontWeight: 'bold',
    borderWidth:  0,  
    marginRight: 15,
    marginLeft:15,
    marginBottom:5,
    textAlign: 'center'
  },

  post1 : {

    fontSize:20,
    fontfamily:'lucida grande',
    color: '#fffcfa',
    backgroundColor: '#FF7F7F',
    fontWeight: 'bold',
    borderWidth:  0,  
    marginRight: 15,
    marginLeft:15,
    marginBottom:5,
    textAlign: 'center'
  },
  container:{
    borderColor:'#fffcfa',
    borderWidth:3.5,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10

  },
  userName: {
    height:30, 
    marginTop:5,
    marginLeft:10,
    //marginRight:10,
    color: '#fffcfa',

  }

});

export default followerPage
