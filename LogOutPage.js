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
            <View style={styles.background}>
            <Text style= {styles.title}> SPACEBOOK </Text>
            <Text  style ={styles.profileTitle} >LOG OUT</Text>

                <TouchableOpacity>
                   <Text onPress= {() => this.props.navigation.navigate('Profile Page')} style={styles.upDatePost}> BACK TO PROFILE PAGE </Text>
                </TouchableOpacity>
                
                <TouchableOpacity>
                   <Text onPress={() => this.logout()} style={styles.delpost}> LOG OUT, OFF TO SIGN IN PAGE </Text>
                </TouchableOpacity>
                
             
            </View>
        )
    }
}

export default LogOutPage;

const styles = StyleSheet.create({
    title: {
      fontSize: 65,
      fontfamily: 'lucida grande',
      color: '#fffcfa',
    },
    background: {
      backgroundColor: '#800000',
      flex: 1,
    },
    profileTitle: {
      fontSize: 35,
      fontfamily: 'lucida grande',
      color: '#fffcfa',
      marginLeft: 120,
      marginBottom:2
    },
    upDatePost: {
        fontSize:18,
        fontfamily:"lucida grande",
        color: "#fffcfa",
        // borderColor:"#fffcfa",
        borderWidth:0,
        marginTop:20,
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
        fontWeight: 'bold',
        textAlign:'center',
        backgroundColor: '#8FBC8F',
    
      },delpost : {      
        fontSize:18,
        fontfamily:"lucida grande",
        color: "#fffcfa",
        // borderColor:"#fffcfa",
        borderWidth:0,
        marginTop:5,
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
        fontWeight: 'bold',
        textAlign:'center',
        backgroundColor: '#FF7F7F',
      }, 
});