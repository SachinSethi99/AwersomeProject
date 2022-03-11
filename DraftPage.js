import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

class Draft extends Component { // draft page, users drafts from the main wall gets displayed
  constructor(props) {
    super(props);
    // drafts will get stored in a an array
    this.state = {
      draftMessage: [],
    }
  }
  async componentDidMount() {
  // get user creds upon loading of this page
  // checks if token is sync and gets the draft from asyncstorage that has been saved by the user (on their wall)
    const session_token = await AsyncStorage.getItem('@session_token');
    let drafts = await AsyncStorage.getItem("@draftMessages");

       this.unsubscribe = this.props.navigation.addListener('focus', () => {// sets the token and draft
      this.setState({ session_token: session_token})
      this.setState({ draftMessage: JSON.parse(drafts) })
    });
  }

  componentWillUnmount() { // closes functions when user is of the draft page
    this.unsubscribe();
  }
  
  getData = async () => {
    // gets the data of the posts, however this function when looking back is technically in active,
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post" , { 
      // gets the users post, however this is possibly repeteted becuase it used in component did mount, when getting the drafts
      'headers': {
        'X-Authorization':  value,
      },
    })
      .then((response) => { // checks the responses when posts are recived
        if(response.status === 200){
          return response.json();
        }else if(response.status === 401){
          console.log("Data not recived for the draft posts")
        }else{
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          draftMessage: responseJson, // responseJson stored in draftmessage/ however looking back this might override the dafts in async storage
        });
      })
    
      .catch((error) => { // error is caught and printed
        console.log(error);
      });
  };

  sendChat = async () =>{  //sends the chat to profile wall
    let id = await AsyncStorage.getItem('@session_id'); //gets the id and session token from asyncstorage
    let session_token = await AsyncStorage.getItem('@session_token');
    if(this.state.draftMessage !=null){ //if there are drafts, then stringfy the draft into text and post it on the wall
      return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post'   ,{
        method: 'POST',
        headers:  {
          'Content-Type': 'application/json',
          'X-Authorization': session_token},
        body: JSON.stringify({text : this.state.draftMessage})
       
      })
        .then((response) => { //responses when post button is clicked 
          if(response.status === 201){
            console.log("Draft Post sent successfully");
             AsyncStorage.removeItem("@draftMessages")
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
        .catch(error => { //catches error outside the responses
          console.log(error);
          console.log("Draft Post couldn't be sent successfully");
      
        });
    }else{
      console.log(" MAJOR ISSUE UNABLE TO SEND");
    }
  }

  render() {
    if (this.state.draftMessage) { //checks if there draft messages, this rendering is having issues displaying the drafts, I have tried many implamentiaons
      console.log(this.state.draftMessage); 
      return (
          <View style={styles.background}> 
          <Text style= {styles.title}> SPACEBOOK </Text>
           <Text style={styles.profileTitle}> Draft Page  </Text> 

           {/* attmted at using the a flatlist of drafts but it drafts didn't show nor did anything else */}
         
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

              {/* currenly viees the button, and the timestamp of the draft, it gets saved but doens't display or send to users wall */}

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

const styles = StyleSheet.create({ //stylesheet for the draft page
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
