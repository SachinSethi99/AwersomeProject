import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Title, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class editProfileDetails extends Component {
    constructor(props) {
        super(props);
        /* set default placeholder values that we will set our data to */
        this.state = {
            isLoading: true,
            token: "",
            user_id: "",
            username: "",
            name: "",
            user_givenname: "",
            user_familyname: "",
            email: "",
            password: "",
            id: ""
        }
    };
    getData = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id');

        return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
            headers: {
                'X-Authorization': token
            },
            method: 'GET',
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 401) {
                    console.log("Error")
                } else {
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

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
        this.getData();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    updateAccount = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id');
        return fetch('http://localhost:3333/api/1.0.0/user/' + id, {
            given_name: this.state.given_name,
            family_name: this.state.family_name,
            email: this.state.email,
            password: this.state.password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.token
            },
            method: 'PATCH',
        })
            .then((response) => {
                if (response.status === 200) {
                    this.props.navigation.navigate('LoginPage')
                    console.log("Account information updated successfully")

                } else if (response.status === 401) {
                    console.log("error")
                } else {
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
            return (
                <View style={styles.background}>
                    <Title>Edit Account Details!</Title>

                    <TextInput
                        placeholder="First Name"
                        onChangeText={(user_givenname) => this.setState({user_givenname })}
                        value={this.state.username}
                    />

                    <TextInput
                        placeholder="Second Name"
                        onChangeText={(user_familyname) => this.setState({user_familyname })}
                        value={this.state.name}
                    />

                    <TextInput
                        placeholder="Email"
                        keyboardType="email-address"
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                    />

                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                    />



                    <Button onPress={() => this.updateAccount()} style={{
                        top: 250,
                        width: 200,
                        alignSelf: 'center',
                        borderRadius: 10,
                        justifyContent: 'center',
                    }}><Text>Update Account</Text>

                    </Button>
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
    }
})
export default editProfileDetails
