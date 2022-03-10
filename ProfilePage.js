import React, { Component } from 'react';
import { Image, Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import { FlatList } from 'react-native-web';
import { Camera } from 'expo-camera';
/* eslint-disable */ 

class ProfilePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      postData : [],
      id : '',
      text : '',
      post : '',
      post_id2 : '',
      post_id: '',
      isAuthenticated: true,
      photo: null,
      draft: null,
      user_id:''
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getData();
      this.get_profile_image();
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
          postData: responseJson,
        });
      })
      
      .catch((error) => {
        console.log(error);
      });
  };
    
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('LoginPage');
    }
  };

  //send message to server if already authenticated, wait on a promise before doing anything else
  newPost = async () => {
    if (!this.state.isAuthenticated) {
      console.log("Error not authenticated");
    }
    else {
      const id = await AsyncStorage.getItem('@session_id');
      const session_token = await AsyncStorage.getItem('@session_token');
      const post_id = await AsyncStorage.setItem(post_id);
      axios.post('http://localhost:3333/api/1.0.0/user/'+id+'/post', {
        "text":this.state.post,          
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': session_token,
        },
      
      }).then(resp => {
        console.log("Chat publised");
        this.getData();
      })
        .catch(error => {
          console.log(error);
          alert("Post couldn't be sent to the server successfully");
        });
    }
  };

  get_profile_image = async() => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    fetch("http://localhost:3333/api/1.0.0/user/"+id+"/photo", {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        
        });
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  updatePost = async(post_id) => {
    const id = await AsyncStorage.getItem('@session_id');
    const session_token = await AsyncStorage.getItem('@session_token');
  
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post/' + post_id, {
      
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
          
      },
      method: 'PATCH',
      body: JSON.stringify({  "text":this.state.post_id2}),
    })

      .then((response) => {
        if(response.status === 200){
          this.getData();
          console.log("post updated");
        }else if(response.status === 401){
          console.log("Post failed");
        }else{
          throw 'Something went wrong';
        }
      }).catch((error) => {
        console.log(error);
      });
  };


    // save the daraft message to localstorage 
  saveChat = async() => {
     const id = await AsyncStorage.getItem('@session_id');
     this.state.draft = {
      "timestamp": Date.parse(new Date()),
      "text": this.state.postData,
      "author": {
        "user_id": id
      }
    } 
    const draftmess = JSON.stringify(this.state.draft);
    AsyncStorage.setItem('@draftMessages', draftmess).then(() => {
      console.log("Saved draft!");
    }
    )
  
      .catch(() => {
        alert("Error occured saving draft")
      })

  }
      
  deletePost = async(post_id) => {
    const id = await AsyncStorage.getItem('@session_id');
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post/' + post_id, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
        
    })

      .then((response) => {
        this.getData();
        console.log("Item deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  };


  displayPost(item){
    //if(item.author.user_id != this.state.id){
      
      console.log(item.author.user_id),
      console.log(this.state.id),
      <View style={{height:140, backgroundColor: "pink", color: 'black'}}>
      <Text >User : {item.text}   </Text>

    {/* </View>  
    }else{ */}

     {/* </View> <View style={{height:140, backgroundColor: "pink", color: 'black'}}> */}
      <Text >{this.state.id} : {item.text}   </Text>
      
 <TouchableOpacity>
     <Text onPress={() => this.deletePost(item.post_id)} style={styles.delpost} > Delete Post </Text>
 </TouchableOpacity>  

 <TouchableOpacity>
     <Text onPress={() => this.updatePost(item.post_id)} style={styles.upDatePost} > Update Post </Text>
 </TouchableOpacity> 


 <TouchableOpacity>
     <Text onPress={() => this.saveChat()} style={styles.draftPost} > Save Post </Text>
 </TouchableOpacity>
  

 <TextInput placeholder = 'Update Your Post:' 
   style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
     marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
   onChangeText={value => this.setState({post_id2: value})}
   value={this.state.post_id2}
   />

      </View>
      //}
  }


    
  render() {
    if (this.state.isLoading){
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
    }else{
      return (
                <View style={styles.background}>
                <Text style= {styles.title}> SPACEBOOK </Text>
                <Text style={styles.profileTitle} > Profile Page </Text>
                
                <Image
                  source={{
                  uri: this.state.photo,
                  }}
                  style={{
                  borderRadius: 50,
                  width: 100,
                  height: 100,
                  marginLeft:5,
                  borderWidth: 3, 
                  }}
                />

           
                <TextInput placeholder = 'Enter Your Post:' 
                style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                  marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
                onChangeText={value => this.setState({post: value})}
                value={this.state.post}/>
      
                <TouchableOpacity>
                    <Text onPress={() => this.newPost()} style={styles.post} > Add New Post </Text>
                </TouchableOpacity>  


                {/* <FlatList
                data={this.state.postData}
                renderItem={({item}) =>(this.displayPost(item))}  
                keyExtractor={(item,index)=> item.post_id.toString()}
                />    */}
{/* 
                <FlatList
                
                data={this.state.postData}
                renderItem={({item}) => (
                 this.displayPost(item)                  
                  )}
                keyExtractor={(item,index) => item.post_id.toString()}
              /> */}


              <FlatList
                
                data={this.state.postData}
                
                renderItem={({item}) => (
                
                 //this.displayPost(item)
                    <View style={{height:140, backgroundColor: "pink", color: 'black'}}>
                      <Text >{this.state.id} : {item.text}   </Text> 

                    <TouchableOpacity>
                        <Text onPress={() => this.deletePost(item.post_id)} style={styles.delpost} > Delete Post </Text>
                    </TouchableOpacity>  

                    <TouchableOpacity>
                        <Text onPress={() => this.updatePost(item.post_id)} style={styles.upDatePost} > Update Post </Text>
                    </TouchableOpacity> 


                    <TouchableOpacity>
                        <Text onPress={() => this.saveChat()} style={styles.draftPost} > Save Post </Text>
                    </TouchableOpacity>
                     

                    <TextInput placeholder = 'Update Your Post:' 
                      style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                        marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
                      onChangeText={value => this.setState({post_id2: value})}
                      value={this.state.post_id2}
                    />

                   </View>
                )}
                keyExtractor={(item,index) => item.post_id.toString()}
              />    
                
      
              </View>
      );
    }
  }
}
      
const styles = StyleSheet.create({
  title:{
    fontSize:65,
    fontfamily:"lucida grande",
    color: "#fffcfa",
  },
  background : {
    backgroundColor: '#800000',
    flex : 1,
  },
  profileTitle:{
    fontSize:35,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginLeft: 90,
  },

  listDisplay:{
    color:"red",

  },
  profileTitle2:{
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginLeft: 10,

  },
  post : {      
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:-5,
    marginLeft:120,
  },
  friends : {      
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:0,
    marginLeft:75,
  },
  delpost : {      
    fontSize:18,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:-20,
    marginLeft:260,
  },
  upDatePost: {
    fontSize:18,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:0,
    marginLeft:255,

  },
  draftPost: {
    fontSize:18,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:0,
    marginLeft:255,

  },

});

export default ProfilePage;


//  <FlatList
                
//                 data={this.state.postData}
                
//                 renderItem={({item}) => (
                
//                  //this.displayPost(item)
//                     <View style={{height:140, backgroundColor: "pink", color: 'black'}}>
//                       <Text >{this.state.id} : {item.text}   </Text> 

//                     <TouchableOpacity>
//                         <Text onPress={() => this.deletePost(item.post_id)} style={styles.delpost} > Delete Post </Text>
//                     </TouchableOpacity>  

//                     <TouchableOpacity>
//                         <Text onPress={() => this.updatePost(item.post_id)} style={styles.upDatePost} > Update Post </Text>
//                     </TouchableOpacity> 


//                     <TouchableOpacity>
//                         <Text onPress={() => this.saveChat()} style={styles.draftPost} > Save Post </Text>
//                     </TouchableOpacity>
                     

//                     <TextInput placeholder = 'Update Your Post:' 
//                       style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
//                         marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
//                       onChangeText={value => this.setState({post_id2: value})}
//                       value={this.state.post_id2}
//                     />

//                    </View>
//                 )}
//                 keyExtractor={(item,index) => item.post_id.toString()}
//               /> 