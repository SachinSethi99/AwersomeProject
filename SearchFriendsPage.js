import React, { Component } from 'react';
import { Text, View, StyleSheet,TouchableOpacity, TextInput, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//imports friends page
class FriendPages extends Component { //this page is used to find our friends and their wall and view who they follow
  constructor(props) {
    super(props);
    //props to be used for this friends page
    this.state = {
      followers: [],
      following: [],
      foundUser: [],
      friendsData: [],
      search: '',
      profileImage: '',
      userid1: '',
      user_id:'',
      useremail: '',
      username: '',
      name: '',
      token: '',
      query:''
    };
  };

  componentDidMount() { //checks if the user logged in and updates the data function
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
  }
  
  componentWillUnmount() { //closes all function 
    this.unsubscribe();
  }
  
  checkLoggedIn = async () => { //checks if the user is logged in and if not they'll be rediriecred
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('LoginPage');
    }
  };

  getData = async () => { //gets my friends and their data
    const token = await AsyncStorage.getItem('@session_token');      
    return fetch('http://localhost:3333/api/1.0.0/search?search_in=friends&q=' + this.state.query, { //the query finds the friends in my friend list and displays all my frined 
      headers: {
        'X-Authorization':  token
      },
      method: 'GET',
    })
      .then((response) => { //checks the responses, if its 200 then the response is returned 
        if (response.status === 200){
          return response.json();
        } else if (response.status === 400){  //if its a 400, then there issues authorised
          console.log('Error, no frineds found');
        } else { //if the response status isn't found, it will print to console
          console.log('Something went wrong');
        }
      })
      .then((responseJson) => { //the retured response get stored into the friends data array to be extracted by the flat list
        this.setState({
          isLoading: false,
          friendsData: responseJson
        });
      })
      .catch((error) => { //any other errors will be printed to the consolse
        console.log(error);
      });
  };

  render(){ //the render of the friends page
    return (
            <View style={styles.background}>
            <Text style= {styles.title}> SPACEBOOK </Text>
            <Text  style ={styles.profileTitle} >SEARCH FOR FRIENDS</Text>
                           
            <TextInput placeholder = 'SEARCH FOR FRIENDS' 
            style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
              marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
            value={this.state.query} onChangeText={value => this.setState({query: value})}/>
             
            
            {/* user types the friend name in the text input, and the search button is used to display friends section */}
            <TouchableOpacity>
            <Text onPress={() => this.getData()} style={styles.serachBar}> SEARCH </Text>
            </TouchableOpacity> 

            {/* flatlist is used to extract the friend from the friendData array and display it */}
            <FlatList
            data = {this.state.friendsData}
            renderItem={({item}) => (
            <View style={styles.container}> 
            {/* container style used to put a border around the friend section, the frineds names and user names are displayed, as well as options 
            to view their profile and followers */}
              <Text style={styles.userName}> {item.user_givenname} {item.user_familyname} </Text>
              <TouchableOpacity>
                <Text onPress={() => this.props.navigation.navigate('FriendsProfilePage', {user_id: item.user_id} )}  style={styles.post}> VIEW PROFILE </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text onPress={() => this.props.navigation.navigate('Freinds Followers' , {user_id: item.user_id})} style={styles.post} > FOLLOWERS </Text>
              </TouchableOpacity> 
            </View>
            )}
            keyExtractor={(item,index) => item.user_givenname}/>
            </View>
    );
  }
}
const styles = StyleSheet.create({ //stylesheet for the seraching for the frineds page
  background : {
    backgroundColor: '#800000',
    flex : 1,
  },
  title:{
    fontSize:65,
    fontfamily:'lucida grande',
    color: '#fffcfa'
  },
  profileTitle:{
    fontSize:35,
    fontfamily:'lucida grande',
    color: '#fffcfa',
    marginLeft: 25
  },
  profileTitle2:{
    fontSize:20,
    fontfamily:'lucida grande',
    color: '#fffcfa',
    marginLeft: 10
  },
  serachBar:{
    fontSize:20,
    fontfamily:'lucida grande',
    color: '#fffcfa',
    marginTop:-5,
    marginLeft:155,
  },
  userName: {
    height:30, 
    marginTop:5,
    marginLeft:140,
    //marginRight:10,
    color: '#fffcfa',
  },
  container:{
    borderColor:'#fffcfa',
    borderWidth:3.5,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10
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

});
export default FriendPages;