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
      userDetails:[],
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
    this.getUserDetails();
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
  console.log(item)
  if(item.author.user_id==this.state.id){
   
    return(
      
      <View  style={styles.container}>      
        <TextInput placeholder = 'UPDATE YOUR POST' 
          style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
            marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
          onChangeText={value => this.setState({post_id2: value})}
          value={this.state.post_id2}/>

        <TouchableOpacity>
            <Text onPress={() => this.updatePostFriend(item.post_id)} style={styles.upDatePost} > UPDATE POST </Text>
        </TouchableOpacity>
          
        <TouchableOpacity>
            <Text onPress={() => this.deletePostFriends(item.post_id)} style={styles.delpost} > DELETE POST </Text>
        </TouchableOpacity>  

        <Text style={styles.frinedPost}> {item.author.first_name} {item.author.last_name}:  {item.text}</Text>
        
      </View>
      );
  }
    
     
   else{
    return(
      <View style={styles.container1}>

          <Text style={styles.frinedPost}> {item.author.first_name} {item.author.last_name}: {item.text}</Text>
          <TouchableOpacity>
              <Text onPress={() => this.addLike(item.post_id)} style={styles.upDatePost} >  LIKE    </Text>

          </TouchableOpacity>
          <TouchableOpacity>

              <Text onPress={() => this.removeLike(item.post_id)} style={styles.delpost} > REMOVE LIKE</Text>
          </TouchableOpacity>
      </View>
     ); 

   }
   
}

getUserDetails = async() => {
  let { user_id} = this.props.route.params;
  const id = await AsyncStorage.getItem('@session_id');
  const token = await AsyncStorage.getItem('@session_token');
  console.log(user_id);
  return fetch("http://localhost:3333/api/1.0.0/user/"+ user_id, {
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


  render() {
    return (
      
      <View style={styles.background}>
        <Text style={styles.title}> SPACEBOOK </Text>
        <Text style={styles.profileTitle}>FRIENDS PROFILE</Text>
        <Image
                  source={{
                  uri: this.state.photo,
                  }}
                  style={{
                  borderRadius: 50,
                  width: 90,
                  height: 90,
                  marginLeft:5,
                  borderWidth: 3, 
                  }}
                />

                <Text>{this.state.userDetails.first_name} {this.state.userDetails.last_name}</Text>
                <Text>{this.state.userDetails.friend_count}</Text>

                

        <TextInput placeholder = 'Enter Your Post On Friend Wall:' 
            style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
            marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
            onChangeText={value => this.setState({post: value})}
            value={this.state.post}/>

        <TouchableOpacity>
          <Text onPress={() => this.newPostFriends()} style={styles.post} > ADD NEW POST </Text>
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
    backgroundColor: '#800000',
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
  frinedPost:{
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginLeft: 5,
    marginBottom: 5

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
    // borderColor:"#fffcfa",
    borderWidth:0,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10,
    fontWeight: 'bold',
    textAlign:'center',
    backgroundColor: '#8FBC8F',

  },delpost : {      
    fontSize:18,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    // borderColor:"#fffcfa",
    borderWidth:0,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10,
    fontWeight: 'bold',
    textAlign:'center',
    backgroundColor: '#FF7F7F',
  },  
  container:{
    borderColor:"#fffcfa",
    borderWidth:3.5,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10
  },
  container1:{
    borderColor:"#DAA520",
    borderWidth:3.5,
    marginTop:5,
    marginBottom:5,
    marginLeft:10,
    marginRight:10
  }

});
export default FriendProfileWall;



