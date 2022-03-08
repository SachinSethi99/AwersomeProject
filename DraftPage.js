import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet, TouchableOpacity, 
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  this.setState({ session_token: session_token})
  let drafts = await getItem("@draftMessages")
  this.setState({ draftMessage: JSON.parse(drafts) })
}
//send the draft message to the server
sendChit = async () => {
  axios.post('http://localhost:3333/api/1.0.0/user/'+id+"/post", this.state.draftMessage
  //axios.post('http://localhost:3333/api/1.0.0/user/', this.state.draftMessage
      , {
          headers: {
              'Content-Type': 'application/json',
              'X-Authorization': this.state.session_token
          }
      }).then(() => {
          console.log("Draft Post sent successfully");
         // this.props.navigation.navigate("Home")
          AsyncStorage.removeItem("@draftMessages")
      })
      .catch(error => {
          console.log(error);
          console.log("Draft Post couldn't be sent to the server successfully");
          //this.props.navigation.navigate("Home")
      });
}


  // <View style={styles.background}>
      //   <Text style={styles.profileTitle}> Draft Page  </Text>
      // </View>


  render() {
    if (this.state.draftMessage) {
      return (
          <View style={styles.background}> 
           <Text style={styles.profileTitle}> Draft Page  </Text>
              
                      <Text>Message: {this.state.draftMessage.chit_content}</Text>
                      <Text>{`${new Date(this.state.draftMessage.timestamp).toLocaleTimeString()} - ${new Date(this.state.draftMessage.timestamp).toLocaleDateString()}`}</Text>
                  
               <TouchableOpacity> 
                 <Text onPress={() => this.sendChit()} >Post Draft</Text>
               </TouchableOpacity>
          </View>
      );
  }
  else {
      return (
          <View>
        
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
    backgroundColor: '#4267B2',
    flex: 1,
  },
  profileTitle: {
    fontSize: 35,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
    marginLeft: 90,
  },
});
export default Draft;
