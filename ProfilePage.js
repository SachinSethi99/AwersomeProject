import React, { Component } from 'react';
import { Image, Text, TextInput, View, StyleSheet, TouchableOpacity,FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



class ProfilePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      postData : [],
      userDetails: [],
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
   // this.getData();
    this.getUserDetails();
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
          id:id
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

  getUserDetails = async() => {
    //let { user_id} = this.props.route.params;
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+id, {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 400) {
        console.log('Error');
      } else {
        throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({
        //add userDetails in constructor at the
        userDetails:responseJson
      });
    })
    .catch((error) => {
      console.log(error);
    });
  };
  



  displayPost(item){
    console.log(item.author.user_id)
    console.log(this.state.id)
    if(item.author.user_id==this.state.id){
      return(
        <View style={styles.container1}>
         <Text style={styles.frinedPost}> {item.author.first_name} {item.author.last_name}: {item.text}   </Text> 


                              <TextInput placeholder = 'UPDATE YOUR POST:' 
                               style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                                marginLeft: 10,marginRight:10, marginTop: 5,marginBottom:10, borderWidth: 2}}
                               onChangeText={value => this.setState({post_id2: value})}
                               value={this.state.post_id2}
                             />

                              <TouchableOpacity>
                                 <Text onPress={() => this.updatePost(item.post_id)} style={styles.upDatePost} > UPDATE POST </Text>
                             </TouchableOpacity> 
        
                             <TouchableOpacity>
                                 <Text onPress={() => this.deletePost(item.post_id)} style={styles.delpost} > DELETE POST </Text>
                             </TouchableOpacity>    
        
                             <TouchableOpacity>
                                 <Text onPress={() => this.saveChat()} style={styles.draftPost} > SAVE POST </Text>
                             </TouchableOpacity>
                             
        
                          
        
                            </View>

      );
     }
    else{
      return(
      <View style={styles.container2}>
      
        <Text style={styles.post4}> {item.author.first_name} {item.author.last_name} : {item.text}   </Text> 
      </View>
        
      );
      
    }
     
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
                  borderWidth: 0, 
                  }}
                />
                <Text style={styles.post2}> YOUR PROFILE: {this.state.userDetails.first_name} {this.state.userDetails.last_name}</Text>
                <Text style={styles.post3}> FRIEND COUNT: {this.state.userDetails.friend_count}</Text>

           
                <TextInput placeholder = 'ENTER YOUR POST:' 
                style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
                  marginLeft: 10,marginRight:10, marginTop: 25,marginBottom:10, borderWidth: 2}}
                onChangeText={value => this.setState({post: value})}
                value={this.state.post}/>
      
                <TouchableOpacity>
                    <Text onPress={() => this.newPost()} style={styles.post} > ADD NEW POST </Text>
                </TouchableOpacity>  

                 <FlatList
                 data={this.state.postData}
                 renderItem={({item}) => (this.displayPost(item)
                
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
  frinedPost:{
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginLeft: 0,
    marginBottom: 5

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
  frinedPost:{
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginLeft: 5,
    marginBottom: 5
  },
  container:{
    borderColor:"#fffcfa",
    borderWidth:3.5,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10
  },
  delpost : {      
    fontSize:18,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10,
    fontWeight: 'bold',
    textAlign:'center',
    backgroundColor: '#FF7F7F',
  },
  upDatePost: {
    fontSize:18,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10,
    fontWeight: 'bold',
    textAlign:'center',
    backgroundColor: '#8FBC8F',

  },
  draftPost: {
    fontSize:18,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10,
    fontWeight: 'bold',
    textAlign:'center',
    backgroundColor: "#DAA520" ,

  },
  post2 : {      
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginBottom:0,
    marginLeft:105,
    marginTop:-70,
  },
  post3 : {      
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginBottom:0,
    marginLeft:105,
  },
  post4 : {      
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginBottom:0,
    marginLeft:10,
  },

  container1:{
    borderColor: "#DAA520" ,
    borderWidth:3.5,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10,
  },
  container2:{
    borderColor: "#fffcfa",
    borderWidth:3.5,
    marginTop:10,
    marginBottom:5,
    marginLeft:10,
    marginRight:10,
    height: 60
  },

});

export default ProfilePage;


