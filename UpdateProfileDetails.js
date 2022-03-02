import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Title, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class editProfileDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true, //boolean varible
            id: '',
            first_name: '',
            last_name: '',
            email:'',
            //password: '',
            new_first_name:'',
            new_last_name:'',
            new_email:'',
           // new_password:''
        };
      
      }

      updateDetails = async() =>
      {
          let to_Send = {};       
          if(this.state.first_name !=this.state.new_first_name){
                  to_Send['first_name'] = this.state.first_name;
            }

            if(this.state.last_name !=this.state.new_last_name){
                to_Send['last_name'] = this.state.last_name;
          }

          if(this.state.email !=this.state.new_email){
            to_Send['email'] = this.state.email;
            }

        //   if(this.state.password !=this.state.password){
        //      to_Send['password'] = this.state.password;
        //      }

           // console.log(JSON.stringify(to_Send));

            const token = await AsyncStorage.getItem('@session_token');
            const id = await AsyncStorage.getItem('@session_id');
          

          return fetch("http://localhost:3333/api/1.0.0/user/"+id,{ 
              method: 'PATCH', 
              headers: {
                  'Content-Type': 'application/json',
                  'X-Authorization':  token
              }, 
              body: JSON.stringify(to_Send) //stings the values in
          })
          .then((response)=>{
              if(response.status === 200){
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
             
              <Text style= {styles.details}>Update Details </Text>
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


              <TouchableOpacity>
                  <Text onPress={()=> this.updateDetails()} style= {styles.createAccount}> Update Account</Text>
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
export default editProfileDetails
