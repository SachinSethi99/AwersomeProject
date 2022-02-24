import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, SearchBar, Alert, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class requestfriends extends Component {
    constructor(props) {
        super(props);
        this.state = {

            friendData: [],
            //profileImage: ""
            id: "",
            first_name: '',
            last_name: '',
            email: '',
            followersNames: "",
            followingNames: "",
            token: "",
            user_id: "",
            user_givenname: ""
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

    return fetch("http://localhost:3333/api/1.0.0/search", {

          headers: {

            'X-Authorization':  token

          },

          method: 'GET',

        })

        .then((response) => {

            if(response.status === 200){

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

    // getData = async () => {
    //     const token = await AsyncStorage.getItem('@session_token');
    //     const id = await AsyncStorage.getItem('@session_id');
    //     // const post_id = await AsyncStorage.setItem('@session_post_id');
    //     return fetch("http://localhost:3333/api/1.0.0/serach", {
    //         'headers': {
    //             'X-Authorization': token
    //         },
    //         method : 'GET',
    //     })

    //         .then((response) => {
    //             if (response.status === 200) {
    //                 return response.json()
    //             } else if (response.status === 401) {
    //                 console.log("Issues")
    //             } else {
    //                 throw 'Something went wrong';
    //             }
    //         })
    //         .then((responseJson) => {
    //             this.setState({
    //                 isLoading: false,
    //                 friendData: responseJson
    //             })
    //         })

    //         .catch((error) => {
    //             console.log(error);

    //         })
    // }


    searchFriends = async() =>{
        const token = await AsyncStorage.getItem('@session_token');
        this.setState({ token: token })
        this.setState({ followersNames: "" })
        this.setState({ followingNames: "" })
        this.setState({ foundUser: null })
        axios.get("http://localhost:3333/api/1.0.0/search/")
        .then(resp => {
            this.setState({ foundUser: resp.data });
            this.state.foundUser.map(({ user_id, given_name, family_name, email }) => {
                this.setState({ userid: user_id })
                this.setState({ username: given_name })
                this.setState({ name: family_name })
                this.setState({ useremail: email })
            })
            this.getFollowers(this.state.first_name)
            this.getFollowing(this.state.last_name)

        });

    }


    sendRequest = async(user_id) => {
            axios.post("http://localhost:3333/api/1.0.0/user/"+user_id+"/friends", {
                headers: {
                    // 'Content-Type': 'application/json',
                    'X-Authorization': this.state.token
                }
            })
                .then(() => {
                    // this.getData();
                    alert("Follow Completed!")
                })
                .catch(() => {
                    alert("Error")
                })
        }

    // removeRequest = () => {
    //     axios.delete("http://localhost:3333/api/1.0.0/friendrequests/" + user_id , {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-Authorization': this.state.token
    //          }
    //     })
    //         .then(() => {
    //             alert("Unfollow Completed!")
    //         })
    //         .catch(() => {
    //             alert("Not Following User!")
    //         })
    //  }




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
                    <Text style={styles.title}> SPACEBOOK </Text>
                    <Text style={styles.profileTitle} > Request Friends </Text>

            
                                <TextInput placeholder='Send Friend Request'
                                    style={{
                                        fontSize: 25, backgroundColor: '#ffffff', textAlign: 'center',
                                        marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10, borderWidth: 2
                                    }}
                                    onChangeText={value => this.setState({ user_givenname: value })}
                                    value={this.state.user_givenname}
                                />


                        <TouchableOpacity>
                        <Text onPress={() => this.searchFriends()} style={styles.post} > Search </Text>
                        </TouchableOpacity>
                        
                        <FlatList
                        data = {this.state.friendsData}
                        renderItem={({item}) => (

                        <View>
                        <Text style={{height:30, backgroundColor: '#ffffff', color: 'black'}}> User Name: {item.user_givenname} {item.user_familyname}
                        </Text>
                </View>

)}

keyExtractor={(item,index) => item.user_givenname}/>

                                {/* <TouchableOpacity>
                                    <Text onPress={() => this.getData(item.user_givenname)}>    Search For Friend      </Text>
                                </TouchableOpacity> */}

                 

                </View>
            );


        }
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 65,
        fontfamily: "lucida grande",
        color: "#fffcfa"
    },
    background: {
        backgroundColor: '#4267B2',
        flex: 1,
    },
    profileTitle: {
        fontSize: 35,
        fontfamily: "lucida grande",
        color: "#fffcfa",
        marginLeft: 90
    },
    post: {
        fontSize: 20,
        fontfamily: "lucida grande",
        color: "#fffcfa",
        marginTop: -5,
        marginLeft: 120
    },

    post3 : {

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

    post2: {
        fontSize: 20,
        fontfamily: "lucida grande",
        color: "#fffcfa",
        marginTop: -5,
        marginLeft: 160
    }
});

export default requestfriends

