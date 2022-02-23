import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-web';

class SignUpPage extends Component {
        constructor(props){
          super(props);
          this.state = {
              isLoading: true, //boolean varible
              id: '',
              first_name: '',
              last_name: '',
              email:'',
              password: '',
          };
        
        }

        SignUp = () =>
        {
            let to_Send = {
                first_name:this.state.first_name,
                last_name: this.state.last_name,
                email:this.state.email,
                password:this.state.password,
            };

            return fetch("http://localhost:3333/api/1.0.0/user",{ 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(to_Send) //stings the values in
            })
            .then((response)=>{
                if(response.status === 201){
                    this.props.navigation.navigate("LoginPage");
                }else if(response.status ===401){
                    throw "email and password already used before or either/both email password are invlaid"
                }else{
                    throw "Something happened"
                }  
            }).catch((error)=>{
                console.log(error);
            })
            
        }//connect to the API, get the token on the website, I can see it 

        render(){
            return (
            
                <View style={styles.background}>
                <Text style= {styles.title}> SPACEBOOK </Text>
               
                <Text style= {styles.details}>Enter Details</Text>
                <TextInput
                placeholder='First Name' 
                style = {{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:0, borderWidth: 2 }}
                onChangeText={value => this.setState({first_name:value})}
                value={this.state.first_name}
                />

              
                <TextInput
                placeholder='Second Name' 
                style = {{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:0, borderWidth: 2 }}
                onChangeText={value => this.setState({last_name:value})}
                value={this.state.last_name}
                />

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
                secureTextEntry={true}
                onChangeText={value => this.setState({password:value})}
                value={this.state.password}
                />

                <TouchableOpacity>
                    <Text onPress={()=> this.SignUp()} style= {styles.createAccount}> Create Account</Text>
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
    
    details:{
        marginTop:200,
        marginLeft:140,
        fontSize:20,
        fontfamily:"lucida grande",
        color: "#fffcfa"

    },

    createAccount:{
        fontSize:20,
        fontfamily:"lucida grande",
        color: "#fffcfa",
        marginTop:10,
        marginLeft:120

    }
});

export default SignUpPage

