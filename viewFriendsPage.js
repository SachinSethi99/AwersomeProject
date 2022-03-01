import React, { Component, useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, SearchBar, Alert,Card, CardItem,  TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


class followerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            friendData: [],
            id: "",
            first_name: '',
            last_name: '',
            email: '',
            user_id: "",
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
    
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
          headers: {
            'X-Authorization':  token
          },
          method: 'GET',
        })
        .then((response) => {
            if(response.status === 200){
               return response.json()
            }else if(response.status === 401){
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

    acceptRequest = async(user_id) => {
            const token = await AsyncStorage.getItem('@session_token');
            const id = await AsyncStorage.getItem('@session_id');
            return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+user_id, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token
                },
                method: 'POST',
            })
                .then((response) => {
                    if(response.status === 200){
                        console.log("Accpeted Request")
                    }else if(response.status === 401){
                        console.log("Not Accpted")
                      }else{
                          throw 'Something went wrong';
                      }
                    }
                )
                .catch((error) => {
                    console.log(error)
                })
        }

    rejectRequest = async(user_id) => {
            const token = await AsyncStorage.getItem('@session_token');
            const id = await AsyncStorage.getItem('@session_id');
            return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id , {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
             },
             method: 'DELETE',
        })
            .then(() => {
                if(response.status === 200){
                    console.log("Follow Deleted")
                }else if(response.status === 401){
                    console.log("Request not rejected")
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
        } else{

            return (      
              <View style={styles.background}>
                <Text style={styles.profileTitle}> SEARCH REQUESTS  </Text>
              <FlatList
              data = {this.state.friendsData}
              renderItem={({item}) => (
                <View>
                <Text style={{height:100, backgroundColor: '#fafa75', color: 'black'}}> Outstanding Friend Requests: {item.first_name} {item.last_name}
                </Text>
      
            <TouchableOpacity>
            <Text onPress={() => this.acceptRequest(item.user_id)} style={styles.post} > Accept </Text>
            </TouchableOpacity>
      
            <TouchableOpacity>
            <Text onPress={() => this.rejectRequest(item.user_id)} style={styles.post} > Reject  </Text>
            </TouchableOpacity>  
      
                </View>
      
              )}
      
               keyExtractor={(item,index) => item.user_givenname} />
      
              </View>
      
            );
      
           }
      
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
  },

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

export default followerPage



