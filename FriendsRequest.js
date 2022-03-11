import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class requestfriends extends Component { //friends request page, where user searches for the friend and requests to add them
  constructor(props) {
    //props to be used when seraching the frined and to send a request
    super(props);
    this.state = {
      isLoading: true,
      friendData: [],
      foundUser: [],
      id: "",
      first_name: '',
      last_name: '',
      token: "",
      user_id: '',
      user_givenname: "",
      user_familyname:"",
      query:""
    }
  };

  componentDidMount() { //check if user logged in and updates the data
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
  }

  componentWillUnmount() { //closes function when user not on the page
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('LoginPage');
    }
  };


  getData = async () => { //get data. searched for the frineds that you can add, 
    const token = await AsyncStorage.getItem('@session_token');  
    return fetch("http://localhost:3333/api/1.0.0/search?q="+ this.state.query, { //returns the friend with same or similar query from the server. gets all possible friends
      headers: {
        'X-Authorization':  token
      },
      method: 'GET',
    })
      .then((response) => {
        if(response.status === 200){ //if friend found then its gets retured else if it'll meet the other responsees in which the console says what the issue is
          return response.json()
        }else if(response.status === 400){
          console.log("Bad Request, possible friend already added")
        } else if(response.status ===401){
          console.log("Can't add that friend");
        } else if(response.status ===500){
          console.log("Server Error");
        }      
        
        else{ //if no resposne meet, then something wrong has happend
          console.log( "Something went wrong");
        }
      })
      .then((responseJson) => { //the resonsejson data is stored in friends data to be extracted when using the flatlist
        this.setState({
          isLoading: false,
          friendsData: responseJson
        })

      })
      .catch((error) => { //any other errors found will be displayed
        console.log(error);
      })
  }

  sendRequest = async(user_id) => { //gets the user id of that friend and sends them a request
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/friends", { //the url to send a friend request to another user, it posted to the server
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      method: 'POST',
    })
      .then((response) => {
        if(response.status === 200){ //if follow successful, then the conolse says follow completed
          console.log("Follow Completed")
        }else if(response.status === 401){ //other responses will display in the console the issue 
          console.log("Unauthorised")
        }else if(response.status === 403){
          console.log("User Already added")
        }else if (response.status === 404){
          console.log("Frined not found");
        }else if (response.status === 500){
          console.log("Server Error");
        }
      })
      .catch((error) => { //any other errors is caught and displayed
        console.log(error)
      })
  }

  render() { //render the friends request page
    if (this.state.isLoading) { //if is loading is true then it displays nothing
      return (
                <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                </View>
      );
    } else {
      return (

    <View style={styles.background}>
    <Text style= {styles.title}> SPACEBOOK </Text>
    <Text style={styles.profileTitle} > FIND FRIENDS </Text>

    {/* the user enters the friends name and searches for them, the "search for friend" button will display the friend that they typed in */}

    <TextInput placeholder='ENTER NAME TO FIND FRIEND' 
    style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
      marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
    value={this.state.query} onChangeText={value => this.setState({query: value})}/>

    <TouchableOpacity>
          <Text onPress={() => this.getData()} style={styles.serachBar} > SEARCH FOR FRIEND</Text>
    </TouchableOpacity>


    {/* the flatlist gets all the frineds and display their details, and in each section each friend can be added that sends that friend a request */}
    <FlatList
    data = {this.state.friendsData}
    renderItem={({item}) => (
    <View style={styles.container}>
      <Text style={styles.userName}> {item.user_givenname} {item.user_familyname}
      </Text>

      <TouchableOpacity>
        <Text onPress={() => this.sendRequest(item.user_id)} style={styles.post} > ADD FRIEND </Text>
      </TouchableOpacity>
    </View>
    )}
      keyExtractor={(item,index) => item.user_givenname}/>
    </View>
      );
    }
  }
}

const styles = StyleSheet.create({ //style sheet for the friends request page

  post : {
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    backgroundColor: '#8FBC8F',
    fontWeight: 'bold',
    borderWidth:  0,  
    marginRight: 15,
    marginLeft:15,
    marginBottom:5,
    textAlign: 'center'

  },
  container:{
    borderColor:"#fffcfa",
    borderWidth:3.5,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10


  },
  serachBar:{
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:-5,
    marginLeft:105,
  },
  title:{
    fontSize:65,
    fontfamily:"lucida grande",
    color: "#fffcfa",
  },
  background : {
    backgroundColor: '#800000',
    flex : 1,
  },
  profileTitle:{
    fontSize:35,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginLeft: 90,
  },
  userName: {
    height:30, 
    marginTop:5,
    marginLeft:145,
    //marginRight:10,
    color: "#fffcfa",

  }

});

export default requestfriends



