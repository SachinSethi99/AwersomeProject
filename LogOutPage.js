import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogOutPage extends Component{ //logout page for the user
    //props declared to log out the user out of their session
    constructor(props){
        super(props);
        this.state = {
            id: '',
            token: ''
        };
      
      }
      //checks if the user is log by fetching their token
    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
    }        
    
    //stop the other functions so other users can't access your information
    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => { //checks if the user is logged in by getting their session token, if there a token then it gets set
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
    }

    logout = async () => {
        //log out function for the user 

        //gets the session token and remove the token from async storage, as result because there is no token user can't access the account
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => { //responses if logout is sucessful or not, if it is 200 then user gets directed to login page, else its the other responses
            if(response.status === 200){
                this.props.navigation.navigate("LoginPage");
            }else if(response.status === 401){
                console.log("Error Logging out");
            }else if (response.status ===500){
                console.log("Sever Error, reconnect to the server")
            }
            
            else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => { //other errors are caught, and displayed
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            // the logout page displayed
          <View style={styles.background}>
            <Text style={styles.title}> SPACEBOOK </Text>
            <Text  style={styles.profileTitle} >LOG OUT</Text>

            {/* user has 2 options, one to go back to their profile or offically logout */}
            <TouchableOpacity>
                <Text onPress={() => this.props.navigation.navigate('Profile Page')} style={styles.upDatePost}> BACK TO PROFILE PAGE </Text>
            </TouchableOpacity>
                
            <TouchableOpacity>
                <Text onPress={() => this.logout()} style={styles.delpost}> LOG OUT, OFF TO SIGN IN PAGE </Text>
            </TouchableOpacity>
                
             
          </View>
        )
    }
}

export default LogOutPage;

//stylesheet for the logout page
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