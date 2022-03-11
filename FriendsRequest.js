import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class requestfriends extends Component { //friends request page, where user searches for the friend and requests to add them
    constructor(props) {
      //props to be used when seraching the frined
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
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');
    
    return fetch("http://localhost:3333/api/1.0.0/search?q="+ this.state.query, {
          headers: {
            'X-Authorization':  token
          },
          method: 'GET',
        })
        .then((response) => {
            if(response.status === 200){
               return response.json()
            }else if(response.status === 400){//401 and 50
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('LoginPage');
    }
  };

    sendRequest = async(user_id) => {
            const token = await AsyncStorage.getItem('@session_token');
            return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/friends", {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token
                },
                method: 'POST',
            })
                .then((response) => {
                    if(response.status === 200){
                        console.log("Follow Completed")
                    }else if(response.status === 401){
                        console.log("Unauthorised")
                      }else if(response.status === 403){
                        console.log("User Already added")
                      }
                    })
                .catch((error) => {
                    console.log(error)
                })
        }


    render() {
        if (this.state.isLoading) {
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

    <TextInput placeholder='ENTER NAME TO FIND FRIEND' 
    style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
    marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
    value={this.state.query} onChangeText={value => this.setState({query: value})}/>

    <TouchableOpacity>
          <Text onPress={() => this.getData()} style={styles.serachBar} > SEARCH FOR FRIEND</Text>
    </TouchableOpacity>

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



const styles = StyleSheet.create({

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



