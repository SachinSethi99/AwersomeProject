import React, { Component, useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, SearchBar, Alert,Card, CardItem,  TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



class requestfriends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            friendData: [],
            foundUser: [],
            //profileImage: ""
            id: "",
            first_name: '',
            last_name: '',
            email: '',
            followersNames: "",
            followingNames: "",
            token: "",
            user_id: "",
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Log In');
    }
  };

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

    sendRequest = async(user_id) => {
            const token = await AsyncStorage.getItem('@session_token');
            const id = await AsyncStorage.getItem('@session_id');
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
                        console.log("Follow Not Sent")
                      }else{
                          throw 'Something went wrong';
                      }
                    }
                )
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
//             return (
//                 <View style={styles.background}>
//                     <Text style={styles.title}> SPACEBOOK </Text>
//                     <Text style={styles.profileTitle} > Request Friends </Text>

            
//                                  <TextInput placeholder='Send Friend Request'
//                                     style={{
//                                         fontSize: 25, backgroundColor: '#ffffff', textAlign: 'center',
//                                         marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10, borderWidth: 2
//                                     }}                                  
//                                   value={this.state.query}
//                                   onChangeText ={  value => this.setState({query:value})  }
                                  
//                                 />

//                         <TouchableOpacity>
//                         <Text onPress={() => this.getData()} style={styles.post} > Search Friend </Text>
//                         </TouchableOpacity> 
                        
//                         <FlatList
//                         data = {this.state.friendData}
//                         renderItem={({item}) => (
//                             <View>

//                                 <Text style={{backgroundColor: '#ffffff', color: 'black'}}> User Name : {item.user_givenname} </Text>
//                                 <TouchableOpacity>
//                                          <Text onPress={() => this.sendRequest(item.user_id)} style={styles.post} > Search Friend </Text>
//                                 </TouchableOpacity> 
//                             </View>

//                         )}
                        
//                         keyExtractor={(item,index) => item.user_givenname}
//                         />

                
//                 </View>
//             );


//         }
//     }
// }

// const styles = StyleSheet.create({
//     title: {
//         fontSize: 65,
//         fontfamily: "lucida grande",
//         color: "#fffcfa"
//     },
//     background: {
//         backgroundColor: '#4267B2',
//         flex: 1,
//     },
//     profileTitle: {
//         fontSize: 35,
//         fontfamily: "lucida grande",
//         color: "#fffcfa",
//         marginLeft: 90
//     },
//     post: {
//         fontSize: 20,
//         fontfamily: "lucida grande",
//         color: "#fffcfa",
//         marginTop: -5,
//         marginLeft: 120
//     },

//     post3 : {

//         fontSize: 32,
//         color: '#FFFFFF',
//         backgroundColor: '#81CD2A',
//         width: 160,
//         height: 60,
//         fontWeight: 'bold',
//         borderWidth:  3,  
//         borderColor:  '#e3e327',
//         marginLeft: 135,
//         marginTop: 30,
//         textAlign: 'center'
//       },

//     post2: {
//         fontSize: 20,
//         fontfamily: "lucida grande",
//         color: "#fffcfa",
//         marginTop: -5,
//         marginLeft: 160
//     }
// });

return (

    <View>

      <Text> WELCOME </Text>

      <TextInput placeholder='Enter User Name to add friend:' style={{fontSize: 19, backgroundColor: 'orange', width: 350, height: 40, marginLeft: 40,

    marginTop: 10, borderWidth: 2.5, borderColor: '#FFFFFF'}}

    value={this.state.query} onChangeText={value => this.setState({query: value})}/>



    <TouchableOpacity>

  <Text onPress={() => this.getData()} style={styles.post} > Search </Text>

  </TouchableOpacity>



 

    <FlatList

      data = {this.state.friendsData}

      renderItem={({item}) => (

      <View>

          <Text style={{height:20, backgroundColor: '#fafa75', color: 'black'}}> User Name: {item.user_givenname} {item.user_familyname}

          </Text>

       

  <TouchableOpacity>

  <Text onPress={() => this.sendRequest(item.user_id)} style={styles.post} > Add </Text>

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

    fontSize: 32,

    color: '#FFFFFF',

    backgroundColor: '#81CD2A',

    width: 160,

    height: 60,

    fontWeight: 'bold',

    borderWidth:  3,  

    borderColor:  '#e3e327',

    marginLeft: 135,

    marginTop: 30,

    textAlign: 'center'

  },

});

export default requestfriends



