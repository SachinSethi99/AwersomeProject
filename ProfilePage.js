import React, { Component } from 'react';
import { Image, Text, TextInput, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//imports used for the profile page, ie the wall
class ProfilePage extends Component {
  constructor(props){
     //props used for the profile page, some of the props wern't used however kept in for future modificaiton 
    super(props);
    this.state = {
      isLoading: true,
      postData: [],
      userDetails: [],
      id: '',
      text: '',
      post: '',
      post_id2: '',
      post_id: '',
      isAuthenticated: true,
      photo: null,
      draft: null,
      user_id: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {//runs user is logged in, updates user profile pic, the data(posts) and their details functions
      this.checkLoggedIn();
      this.getData();
      this.get_profile_image();
    });
   // this.getData();
    this.getUserDetails();
  }
    
  componentWillUnmount() { //closes all functions when not on the page
    this.unsubscribe();
    
  }
  
  checkLoggedIn = async () => { //checks if user logged in and if not then they get sent to login page
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('LoginPage');
    }
  };
    

  getData = async () => { // get users list of all the posts on the usser profile
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post" , { // uses the id to get all of the post assoiated with their account
      'headers': {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if(response.status === 200){ //if the resposne is 200 then responsejson will store in the post data array, else it will show an issue
          return response.json();
        }else if(response.status === 401){
          this.props.navigation.navigate("LogIn");
        }else{
          console.log('Something went wrong');
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          postData: responseJson,
          id: id,
        });
      })
      
      .catch((error) => { //catch all other errors and console log them 
        console.log(error);
      });
  };




  //send message to server if already authenticated, wait on a promise before doing anything else
  newPost = async () => {
    if (!this.state.isAuthenticated) { //checks if the authenticated
      console.log("Error not authenticated");
    }
    else {
      const id = await AsyncStorage.getItem('@session_id');  //get id and token and sets the post to asyncstorage 
      const session_token = await AsyncStorage.getItem('@session_token');
      const post_id = await AsyncStorage.setItem(post_id);
      axios.post('http://localhost:3333/api/1.0.0/user/'+id+'/post', { //posts the posts to server storage and sets the post into the text field
        "text": this.state.post,          
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': session_token,
        },
      
      }).then(response => {//responses
        if(response.status ===201){ //if response is 201 then chat can be added else the other responses will consolse log the issue 
          console.log("Chat publised");
          this.getData();
        }else if(response.status === 401){
          console.log("Can't add chat");
        }else if(response.status === 404){
          console.log("Chat not found");
        }else if (response.status === 500){
          console.log("Server Error");
        }else{//any other response prints the error to the console 
          console.log("Something went wrong")
        }
      })
        .catch(error => {
          console.log(error);
          alert("Post couldn't be sent to the server successfully");
        });
    }
  };

  get_profile_image = async() => { //gets the image of the  profile
    const id = await AsyncStorage.getItem('@session_id'); //gets id and token for the user
    const token = await AsyncStorage.getItem('@session_token');
    fetch("http://localhost:3333/api/1.0.0/user/"+id+"/photo", { //returns the profile image, by getting it from the server
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => {
        return res.blob(); //response retunrs the blog fuction, in which then resblog used an object that holds the image of the user, the photo prop sotres that photo 
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        
        });
      })
      .catch((error) => { //any other response prints the error to the console 
        console.log("error", error );
      });
  };

  updatePost = async(post_id) => { //updates post on wall, by getting the post id
    const id = await AsyncStorage.getItem('@session_id');
    const session_token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post/' + post_id, { //gets the  id and post id to find which post to update on the wal, in the server storage 
    //the post gets patched to be changed with
      
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
          
      },
      method: 'PATCH', //post gets patched to be altered, the new post will be replaced with a new post id to differenceate the posts
      body: JSON.stringify({ "text": this.state.post_id2}),
    })

      .then((response) => {
        if(response.status === 200){//if updated post then response is 200 and data is updated and post is updated from the wall, else the other resposnes will console log the issue 
          this.getData();
          console.log("Post updated");
        }else if(response.status === 401){
          console.log("Post update failed");
        }else if (response.status === 403){
          console.log("Forbidden - you can only update your own posts");
        }else if (response.status === 404){
          console.log("Update post cannot be found");
        }else if(response.status === 500){
          console.log("Server Error");
        }else{//any other response prints the error to the console 
          console.log("Something went wrong")
        }

      }).catch((error) => {
        console.log(error);
      });
  };


    // save the daraft message to localstorage 
  saveChat = async() => {
     const id = await AsyncStorage.getItem('@session_id'); //gets the id from async storage and, pasrse the timestame, the post data, and user id as a draft this what it will get stored as
     this.state.draft = {
      "timestamp": Date.parse(new Date()),
      "text": this.state.postData,
      "author": {
        "user_id": id,
      },
    } 
    const draftmess = JSON.stringify(this.state.draft); //sets draft in async storage and if successful it saves, however resposnses haven't been added yet
    AsyncStorage.setItem('@draftMessages', draftmess).then(() => {
      console.log("Saved draft!");
    },
    )
  
      .catch(() => {
        alert("Error occured saving draft")
      })

  }
      
  deletePost = async(post_id) => { //function to delete a post on a wall by getting the post id
    const id = await AsyncStorage.getItem('@session_id'); //gets the id and token from async storage
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post/' + post_id, { //gets the id and post id to find which post to delete on the wall, the delete method deleted the post in server storage
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
        
    })
      .then((response) => { //if deleted post then response is 200 and data is updated and post is removed from the wall, else the other resposnes will console log the issue
        if(response.status === 200){
          this.getData();
          console.log("Chat deleted");
        }else if (response.status === 401){
          console.log("Can't delete post");
        }else if (response.status === 403){
          console.log("Forbidden - you can only delete your own posts");
        }else if (response.status === 404){
          console.log("Delete post cannot be found");
        }else if(response.status === 500){
          console.log("Server Error");
        }else{//any other response prints the error to the console 
          console.log("Something went wrong")
        }


      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUserDetails = async() => { //this function gets the details of ids that requires such as name, surename and email etc
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+id, { //get the user information from the server in aysnc storage
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
    .then((response) => { //if getting the details is correct then the data gets stored in array called userDetails to access, any other response will mean theres an error and
    //will be console logged
      if (response.status === 200) {
        return response.json();
      } if (response.status === 401) {
        console.log('Error with getting the user details');
      } else if (response.status === 404){
        console.log('User details not found');
      }
      else { //any other response prints the error to the console 
        console.log('Something went wrong');
      }
    })
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({
        //add resposne into userDetails array
        userDetails: responseJson,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  };
  

  displayPost(item){
    if(item.author.user_id==this.state.id){ //checks if user and friend ids are the same if so then it will display user posts not friend posts on teh wall
      return(
        <View style={styles.container1}>
         <Text style={styles.frinedPost}> {item.author.first_name} {item.author.last_name}: {item.text}   </Text> 


                              <TextInput placeholder = 'UPDATE YOUR POST:' 
                               style={{fontSize: 25, backgroundColor: '#ffffff',textAlign: 'center',
                                marginLeft: 10,marginRight: 10, marginTop: 5,marginBottom: 10, borderWidth: 2}}
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
    else{ //else if they're not the same the its friend posts are displayed and the friend information
      return(
      <View style={styles.container2}>
      
        <Text style={styles.post4}> {item.author.first_name} {item.author.last_name} : {item.text}   </Text> 
      </View>
        
      );
      
    }
     
  }
  render() { //rednders the profile page, 
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
                  marginLeft: 5,
                  borderWidth: 0, 
                  }}
                />

                 {/* display the image of the friend and their detials like name and friends count */}
                <Text style={styles.post2}> YOUR PROFILE: {this.state.userDetails.first_name} {this.state.userDetails.last_name}</Text>
                <Text style={styles.post3}> FRIEND COUNT: {this.state.userDetails.friend_count}</Text>

                  {/* user can enter post and the posts will show in the FlatList all posts from user and friends  */}
           
                <TextInput placeholder = 'ENTER YOUR POST:' 
                style={{fontSize: 25, backgroundColor: '#ffffff',textAlign: 'center',
                  marginLeft: 10,marginRight: 10, marginTop: 25,marginBottom: 10, borderWidth: 2}}
                onChangeText={value => this.setState({post: value})}
                value={this.state.post}/>
      
                <TouchableOpacity>
                    <Text onPress={() => this.newPost()} style={styles.post} > ADD NEW POST </Text>
                </TouchableOpacity>  
                  

                  {/* FlatList uses the displaypost function to render posts */}
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
      
const styles = StyleSheet.create({ //stylesheet for profile page
  title: {
    fontSize: 65,
    fontfamily: "lucida grande",
    color: "#fffcfa",
  },
  background: {
    backgroundColor: '#800000',
    flex: 1,
  },
  profileTitle: {
    fontSize: 35,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginLeft: 90,
  },

  listDisplay: {
    color: "red",

  },
  frinedPost: {
    fontSize: 20,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginLeft: 0,
    marginBottom: 5,

  },
  profileTitle2: {
    fontSize: 20,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginLeft: 10,

  },
  post: {      
    fontSize: 20,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginTop: -5,
    marginLeft: 120,
  },
  friends: {      
    fontSize: 20,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginTop: 0,
    marginLeft: 75,
  },
  frinedPost: {
    fontSize: 20,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginLeft: 5,
    marginBottom: 5,
  },
  container: {
    borderColor: "#fffcfa",
    borderWidth: 3.5,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  delpost: {      
    fontSize: 18,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#FF7F7F',
  },
  upDatePost: {
    fontSize: 18,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#8FBC8F',

  },
  draftPost: {
    fontSize: 18,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "#DAA520" ,

  },
  post2: {      
    fontSize: 20,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginBottom: 0,
    marginLeft: 105,
    marginTop: -70,
  },
  post3: {      
    fontSize: 20,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginBottom: 0,
    marginLeft: 105,
  },
  post4: {      
    fontSize: 20,
    fontfamily: "lucida grande",
    color: "#fffcfa",
    marginBottom: 0,
    marginLeft: 10,
  },

  container1: {
    borderColor: "#DAA520" ,
    borderWidth: 3.5,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  container2: {
    borderColor: "#fffcfa",
    borderWidth: 3.5,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 60,
  },

});

export default ProfilePage;


