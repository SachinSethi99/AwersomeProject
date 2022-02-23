import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class LogOutPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: '',
            token: ''
        };
      
      }


    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
    }        
    

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
    }

    logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("LoginPage");
            }else if(response.status === 401){
                console.log("Error Logging out");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            <View>
                <Button
                    title="I'm outta here"
                    onPress={() => this.logout()}
                />
                <TouchableOpacity>
                   <Text onPress= {() => this.props.navigation.navigate('LoginPage')}> beck to sign in </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default LogOutPage;

