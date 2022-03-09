/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
/* eslint-disable */ 
/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, View, Button,Image, StyleSheet, TouchableOpacity, TextInput,FlatList
} from 'react-native';


import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class FriendProfileWall extends Component {
  constructor(props) {
    super(props);
    /* set default placeholder values that we will set our data to */
    this.state = {
      followers: [],
      following: [],
      foundUser: [],
      search: '',
      profileImage: '',
      userid1: '',
      user_id: '',
      useremail: '',
      username: '',
      name: '',
      followersNames: '',
      followingNames: '',
      token: '',
      text:'',
      query: '',
      postData: [],
      post_id:'',
      post_id2:'',
      photo:null,
      text2:'',
      id: '',

      test1:'',
      
    };
  }

  // get users list of post
  getData = async () => {
    let { user_id} = this.props.route.params;
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');

    return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post", {
      headers: {
        'X-Authorization': token,
      },
      method: 'GET',
    })
      .then((response) => {
        if (response.status === 200) {
          // this.setState({ friendData: response.data });
          return response.json();
        } if (response.status === 400) {
          console.log('Error');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          postData: responseJson,
          id:id
        });
        console.log(this.state.postData)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.get_Friend_profile_image();
    });
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Log In');
    }
  };

  get_Friend_profile_image = async() => {
    let {user_id} = this.props.route.params;
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/photo", {
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


  newPostFriends = async () => {
    let { user_id} = this.props.route.params;
    const id = await AsyncStorage.getItem('@session_id');
    const session_token = await AsyncStorage.getItem('@session_token');
    const post_id = await AsyncStorage.setItem(post_id);
    axios.post('http://localhost:3333/api/1.0.0/user/'+user_id+"/post", {
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
    
  
};

  // delete
  deletePostFriends = async(post_id) => {
    //const id = await AsyncStorage.getItem('@session_id');
    let { user_id} = this.props.route.params;
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch('http://localhost:3333/api/1.0.0/user/'+user_id+'/post/' + post_id, {
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

  // update
  updatePostFriend = async(post_id) => {
    let { user_id} = this.props.route.params;
    const id = await AsyncStorage.getItem('@session_id');
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch('http://localhost:3333/api/1.0.0/user/'+user_id+'/post/' + post_id, {
      
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
          
      },
      method: 'PATCH',
      body: JSON.stringify({ "text":this.state.post_id2}),
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

  // like post
  addLike = async (post_id) => {
    let { user_id} = this.props.route.params;
   // let { post_id} = this.props.route.params;
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => {
        this.getData();
        console.log('like done');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // remove like
  removeLike = async (post_id) => {
    let { user_id} = this.props.route.params;
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
   // let {post_id} =this.props.route.params;
    return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post/"+post_id+"/like", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => {
        this.getData();
        console.log('like deleted');
      })
      .catch((error) => {
        console.log(error);
      });
  };

displayPost(item){

  if(item.author.user_id==this.state.id){
    return(
      <View>
        <TextInput placeholder = 'Update Your Post:' 
          style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
            marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
          onChangeText={value => this.setState({post_id2: value})}
          value={this.state.post_id2}/>

        <TouchableOpacity>
            <Text onPress={() => this.updatePostFriend(item.post_id)} style={styles.upDatePost} > Update Post </Text>
        </TouchableOpacity>
          
        <TouchableOpacity>
            <Text onPress={() => this.deletePostFriends(item.post_id)} style={styles.delpost} > Delete Post </Text>
        </TouchableOpacity>  

        <Text>{item.text}</Text>
        
      </View>
      );
  }
    
     
   else{
    return(
      <View>
          <Text>{item.text}</Text>
          <TouchableOpacity>
              <Text onPress={() => this.addLike(item.post_id)}>  Like    </Text>

          </TouchableOpacity>
          <TouchableOpacity>

              <Text onPress={() => this.removeLike(item.post_id) }> Remove Like</Text>
          </TouchableOpacity>
      </View>
     ); 

   }
   
}
  render() {
    return (
      
      <View style={styles.background}>
        <Text style={styles.title}> SPACEBOOK </Text>
        <Text style={styles.profileTitle}>Friends Profile</Text>
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

  


        <Text > Add Your Post: </Text> 
        <TextInput placeholder = 'Enter Your Post On Friend Wall:' 
            style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
            marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
            onChangeText={value => this.setState({post: value})}
            value={this.state.post}/>

        <TouchableOpacity>
          <Text onPress={() => this.newPostFriends()} style={styles.post} > Add New Post </Text>
        </TouchableOpacity> 

        <FlatList
          data={this.state.postData}
          renderItem={({item}) =>(this.displayPost(item))}
          keyExtractor={(item,index)=> item.post_id.toString()}
        />      

      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#4267B2',
    flex: 1,
  },
  title: {
    fontSize: 65,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
  },
  profileTitle: {
    fontSize: 35,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
    marginLeft: 90,
  },  post : {      
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:-5,
    marginLeft:120,
  },
  profileTitle2: {
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
    marginLeft: 10,

  },  upDatePost: {
    fontSize:18,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:0,
    marginLeft:255,

  },delpost : {      
    fontSize:18,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginTop:0,
    marginLeft:255,
  },

});
export default FriendProfileWall;



