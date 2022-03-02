import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginPage extends Component {
        constructor(props){
          super(props);
          this.state = {
              isLoading: true, //boolean varible, in built property from the server
              id: '',
              email:'sachinsethi1999@gmail.com',
              password: 'sachinsethi',
          };        
        }

        Login = async () =>
        {
            //AsyncStorage.clear()
            // let to_Send = {
            //     email:this.state.email,
            //     password:this.state.password,
            // };

            
            return fetch("http://localhost:3333/api/1.0.0/login", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 400){
                    throw 'Invalid email or password';
                }else{
                    throw 'Something went wrong';
                }
            })
            .then(async (responseJson) => {
              //  this.state.authenticated = true;
                    console.log(responseJson);
                    await AsyncStorage.setItem('@session_id',responseJson.id);
                    await AsyncStorage.setItem('@session_token', responseJson.token);
                    //this.props.navigation.navigate("MainPage");
                    this.props.navigation.navigate("ProfilePage");
            })
            .catch((error) => {
                console.log(error);
            })

        }//connect to the API, get the token on the website, I can see it 

        render(){
            return (
            
                <View style={styles.background}>
                <Text style= {styles.title}> SPACEBOOK </Text>

                <Text style= {styles.login}>Please Login Below</Text>
                <TextInput
                placeholder='Email Address' 
                style = {{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2 }}
                onChangeText={value => this.setState({email:value})}
                value={this.state.email}
                />

                <TextInput
                placeholder='Password'
                style = {{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                marginLeft: 10,marginRight:10, marginTop: 0, marginBottom:0,  borderWidth: 2 }}
                onChangeText={value => this.setState({password:value})}
                secureTextEntry={true}
                value={this.state.password}
                />

                <TouchableOpacity>
                    <Text onPress={()=> this.Login()} style= {styles.signIn}> Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                         <Text onPress={() => this.props.navigation.navigate('SignUpPage')} style= {styles.signUp}> Sign Up</Text>
                </TouchableOpacity>
    
                </View>
            )
          }
}
const styles = StyleSheet.create({
    background : {
        backgroundColor: '#4267B2',
        flex : 1,
    },
    title:{
        fontSize:65,
        fontfamily:"lucida grande",
        color: "#fffcfa"
    },
    
    login:{
        marginTop:200,
        marginLeft:120,
        fontSize:20,
        fontfamily:"lucida grande",
        color: "#fffcfa"

    },

    signIn:{
        fontSize:20,
        fontfamily:"lucida grande",
        color: "#fffcfa",
        marginTop:10,
        marginLeft:155

    },
    signUp:{
        fontSize:20,
        fontfamily:"lucida grande",
        color: "#fffcfa",
        marginTop:5,
        marginLeft:150

    },
});
export default LoginPage