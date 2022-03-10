import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FlatList } from 'react-native-web';
/* eslint-disable */ 
class Draft extends Component {
  constructor(props) {
    super(props);
    /* set default placeholder values that we will set our data to */
    this.state = {
        draftMessage: [],
    }
}
async componentDidMount() {
  //get user creds upon loading of this page
  const session_token = await AsyncStorage.getItem('@session_token');
  let drafts = await AsyncStorage.getItem("@draftMessages");

  this.unsubscribe = this.props.navigation.addListener('focus', () => {
  this.setState({ session_token: session_token})
  this.setState({ draftMessage: JSON.parse(drafts) })
  
  });
}


componentWillUnmount() {
  this.unsubscribe();
}
  
getData = async () => {
  const id = await AsyncStorage.getItem('@session_id');
  const value = await AsyncStorage.getItem('@session_token');
  // const post_id = await AsyncStorage.setItem('@session_post_id');
  return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post" , {
    'headers': {
      'X-Authorization':  value,
    },
  })
  
    .then((response) => {
      if(response.status === 200){
        return response.json();
      }else if(response.status === 401){
        this.props.navigation.navigate("LogIn");
      }else{
        throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        draftMessage: responseJson,
      });
    })
    
    .catch((error) => {
      console.log(error);
    });
};


sendChat = async () =>{
   let id = await AsyncStorage.getItem('@temp_user');
   let session_token = await AsyncStorage.getItem('@session_token');
   let to_send ={
      text:this.state.draftMessage,
   };

   if(this.state.draftMessage !=null){
    return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post'   ,{
          method: 'POST',
          headers:  {'Content-Type': 'application/json',
          'X-Authorization': session_token},
          body: JSON.stringify({text : this.state.draftMessage})
       
      })
       //body: JSON.stringify(this.state) 
      .then((response) => {
        if(response.status === 201){
          console.log("Draft Post sent successfully");
         // this.props.navigation.navigate("Home")
         // AsyncStorage.removeItem("@draftMessages")
          this.getData();
        }else if(response.status === 400){
          console.log("Bad Gateway");
        }else if(response.status === 401){
          console.log("Post failed");
        }else if (response.status ===404){
          console.log("Not found post");
        }else if(response.status ===500){
          console.log("Error with the server")
        }
        else{
          throw 'Something went wrong';
        }
      }
      )
      .catch(error => {
          console.log(error);
          console.log("Draft Post couldn't be sent to the server successfully");
          //this.props.navigation.navigate("Home")
      });



   }else{
     throw "ISSUE"
   }



}


//send the draft message to the server
// sendChat = async () => {
//   const id = await AsyncStorage.getItem('@session_id');
//   const session_token = await AsyncStorage.getItem('@session_token');
//   return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post'   ,{
//     method: 'POST',
//     headers:  {'Content-Type': 'application/json',
//     'X-Authorization': session_token},
//     body: JSON.stringify({text : this.state.draftMessage})
 
// },
// console.log(this.state.draftMessage)

//  //body: JSON.stringify(this.state) 
//   ).then((response) => {
//         if(response.status === 201){
//           console.log("Draft Post sent successfully");
//          // this.props.navigation.navigate("Home")
//          // AsyncStorage.removeItem("@draftMessages")
//           this.getData();
//         }else if(response.status === 400){
//           console.log("Bad Gateway");
//         }else if(response.status === 401){
//           console.log("Post failed");
//         }else if (response.status ===404){
//           console.log("Not found post");
//         }else if(response.status ===500){
//           console.log("Error with the server")
//         }
//         else{
//           throw 'Something went wrong';
//         }
//       }
//       )
//       .catch(error => {
//           console.log(error);
//           console.log("Draft Post couldn't be sent to the server successfully");
//           //this.props.navigation.navigate("Home")
//       });
//}


  render() {
    if (this.state.draftMessage) {
      console.log(this.state.draftMessage);
      return (
          <View style={styles.background}> 
          <Text style= {styles.title}> SPACEBOOK </Text>
           <Text style={styles.profileTitle}> Draft Page  </Text>
         
                {/* <Text>Message: {this.state.draftMessage.Text}</Text>
                <Text>{`${new Date(this.state.draftMessage.timestamp).toLocaleTimeString()} - ${new Date(this.state.draftMessage.timestamp).toLocaleDateString()}`}</Text>
                
                <TouchableOpacity> 
                  <Text onPress={() => this.sendChat()} >Post Draft</Text>
                </TouchableOpacity> */}
                 {/* <FlatList
              data={this.state.draftMessage}
              keyExtractor={(item,index) => item.draftMessage.toString()}
              renderItem={({item}) => (
                
              <View>  */}

                {/* <Text>Message: {this.state.draftMessage}</Text> */}
                <View  style={styles.container}>
                <Text style={styles.frinedPost}>MESSAGE: {this.state.draftMessage.Text}</Text>
                <Text style={styles.frinedPost} >DATE DRAFT SAVED: {`${new Date(this.state.draftMessage.timestamp).toLocaleTimeString()} - ${new Date(this.state.draftMessage.timestamp).toLocaleDateString()}`}</Text>
                
                <TouchableOpacity> 
                  <Text onPress={() => this.sendChat()} style={styles.post}>POST DRAFT</Text>
                </TouchableOpacity>
                </View>
    
            
          
          </View>
      );
  }
  else {
      return (
        <View style={styles.background}> 
        <Text style= {styles.title}> SPACEBOOK </Text>
        <Text style={styles.profileTitle}> Draft Page  </Text>
        <Text>No draft messages found</Text>
        </View>
      )
  }
}
  


    
  
}

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
    marginLeft: 110,
    marginBottom:2
  },
  container:{
    borderColor:"#fffcfa",
    borderWidth:3.5,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10
  }, 
  post : {      
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:5,
    marginBottom:5,
    marginLeft:120,
  },
  frinedPost:{
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginLeft: 5,
    marginBottom: 5

  },
});
export default Draft;

//  <FlatList
//               data={this.state.draftMessage}
//               renderItem={({item}) => (
//               <View> 
//                 {/* <Text>Message: {this.state.draftMessage}</Text> */}
//                 <Text>Message: {this.state.draftMessage}</Text>
//                 <Text>{`${new Date(this.state.draftMessage.timestamp).toLocaleTimeString()} - ${new Date(this.state.draftMessage.timestamp).toLocaleDateString()}`}</Text>
                
//                 <TouchableOpacity> 
//                   <Text onPress={() => this.sendChat()} >Post Draft</Text>
//                 </TouchableOpacity>
//                </View>
//               )}
              
//               keyExtractor={(item,index) => item.draftMessage.toString()}
//             /> 