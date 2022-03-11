import React, { Component } from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//imports used for the friends profile page, ie their wall
class FriendProfileWall extends Component { //friends wall page
  constructor(props) { 
    //props used for the friends wall, some of the props wern't used however kept in for future modificaiton 
    super(props);
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

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => { //runs user is logged in, updates user profile pic, the data(posts) and their details functions
      this.checkLoggedIn();
      this.get_Friend_profile_image();
    });
    this.getData();
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


  // get users list of all the posts on the usser profile
  getData = async () => {
    let { user_id} = this.props.route.params; //gets the id of the friend, if accessed through another user
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');

    return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post", {// uses the friends id to get all of the post assoiated with their account
      headers: {
        'X-Authorization': token,
      },
      method: 'GET',
    })
      .then((response) => {
        if (response.status === 200) { //if getting the data of posts is successful then return it else console log the other issues
          return response.json();
        } if (response.status === 400) {
          console.log('Error, no chats found');
        } else {
          console.log("Server Error Or Chat can be accessed");
        }
      })
      .then((responseJson) => { // stores posts (resposeJson) into the postdata array to be extracted
        this.setState({
          isLoading: false,
          postData: responseJson,
          id:id //id is set to differencate the user and the friend id
        });
        //console.log(this.state.postData) //prints the postdata to conolsole used for debuging
      })
      .catch((error) => { //catch all other errors and console log them 
        console.log(error);
      });
  };

  get_Friend_profile_image = async() => { //gets the image of the friend profile
    let {user_id} = this.props.route.params; //gets the id of the friend, if accessed through another user
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/photo", { //returns the friends profile image, by getting it from the server
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => { //response retunrs the blog fuction, in which then resblog used an object that holds the image of the user, the photo prop sotres that photo 
        return res.blob();
      })
      .then((resBlob) => { 
        let data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data, 
          isLoading: false,

        });
      })
      .catch((error) => { //any other response prints the error to the console 
        console.log("Error", error);
      });
  };


  newPostFriends = async () => { //function to allow user to post on friends wall
    let { user_id} = this.props.route.params;//gets the id of the friend, if accessed through another user
    const session_token = await AsyncStorage.getItem('@session_token');
    const post_id = await AsyncStorage.setItem(post_id); 
    axios.post('http://localhost:3333/api/1.0.0/user/'+user_id+"/post", { //posts the post from user to the friends wall by using the friends id 
      "text":this.state.post, //text stores the post and it can viewes in the server 
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },

    }).then((response) => { 
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
      .catch(error => {//any other response prints the error to the console 
        console.log(error);
      });
};

 
  deletePostFriends = async(post_id) => { //function to delete a post on a friends wall by getting the friends post id
    let { user_id} = this.props.route.params; //gets the id of the friend, if accessed through another user
    const session_token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/'+user_id+'/post/' + post_id, { //gets the friends id and post id to find which post to delete on the wall, the delete method deleted the post in server storage
      method: 'DELETE', //delete method to remove the post
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
      .catch((error) => {//any other response prints the error to the console 
        console.log(error);
      });
  };

  
  updatePostFriend = async(post_id) => { //updates post on friends wall, by getting the friends post id
    let { user_id} = this.props.route.params; //gets the id of the friend, if accessed through another user
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch('http://localhost:3333/api/1.0.0/user/'+user_id+'/post/' + post_id, { //gets the friends id and post id to find which post to update on the wal, in the server storage 
    //the post gets patched to be changed with

      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
      method: 'PATCH', //post gets patched to be altered, the new post will be replaced with a new post id to differenceate the posts
      body: JSON.stringify({ "text":this.state.post_id2}),
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
      }).catch((error) => {//any other response prints the error to the console 
        console.log(error);
      });
  };

  
  addLike = async (post_id) => { //like post function on friends wall, can only friends wall posts 
    let { user_id} = this.props.route.params;
    const session_token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", { 
      //url likes the post by posting to the server using the friend id and the post id
      method: 'POST', //methods to like post in the server
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => { //if response is 200 then the post is liked, if there are other responses then its cause of errors and it'll be logged
        if (response.status === 200){
           this.getData();
           console.log('Like done');
        }else if(response.status === 401){
          console.log("like post failed");
        }else if (response.status === 403){
          console.log("Forbidden - you can only like your friends posts");
        }else if (response.status === 404){
          console.log("Like post cannot be done");
        }else if(response.status === 500){
          console.log("Server Error");
        }else{ //any other response prints the error to the console 
          console.log("Something went wrong")
        }
      })
      .catch((error) => { //any other response prints the error to the console 
        console.log(error);
      });
  };

  
  removeLike = async (post_id) => { //remvoe like on post function on friends wall, can only friends wall posts
    let { user_id} = this.props.route.params; //gets the friend user id 
    const session_token = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post/"+post_id+"/like", {  //url likes the post by posting to the server using the friend id and the post id, 
    //however the method uses DELETE so that will remove the like from the post
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => {
       //if response is 200 then the post is like is removed, if there are other responses then its cause of errors and it'll be logged
        if(response.status === 200){
          this.getData();
          console.log('Like deleted');
        }else if(response.status === 401){
          console.log("Remove like post failed");
        }else if (response.status === 403){
          console.log("Forbidden - you can only remove like your friends posts");
        }else if (response.status === 404){
          console.log("Remove ;ike post cannot be done");
        }else if(response.status === 500){
          console.log("Server Error");
        }else{ //any other response prints the error to the console 
          console.log("Something went wrong")
        }
      })
      .catch((error) => { //any other response prints the error to the console 
        console.log(error);
      });
  };

displayPost(item){ //the display fucntion, validates who posted which post using the ids, and condtionally renders the post in accordance 
  if(item.author.user_id==this.state.id){ // if the friend id and user are the same then, you can update, delete, and your post will show with your name
    return(
      // the stlye container will seperate the posts
      <View  style={styles.container}> 
        <TextInput placeholder = 'UPDATE YOUR POST'
          style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
            marginLeft: 10,marginRight:10, marginTop: 10,marginBottom:10, borderWidth: 2}}
          onChangeText={value => this.setState({post_id2: value})}
          value={this.state.post_id2}/>

          {/* user allowed to update their own post on friends wall, as well as update and delete using the buttons below */}

        <TouchableOpacity>
            <Text onPress={() => this.updatePostFriend(item.post_id)} style={styles.upDatePost} > UPDATE POST </Text>
        </TouchableOpacity>

        <TouchableOpacity>
            <Text onPress={() => this.deletePostFriends(item.post_id)} style={styles.delpost} > DELETE POST </Text>
        </TouchableOpacity>

        {/* displays who's post it is with their details */}
        <Text style={styles.frinedPost}> {item.author.first_name} {item.author.last_name}:  {item.text}</Text>

      </View>
      );
  }

   else{ //else if the ids aren't the same, then user can only like and remove on the friends posts on the friends wall
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

getUserDetails = async() => { //this function gets the details of ids that requires such as name, surename and email etc
  let { user_id} = this.props.route.params;
  const id = await AsyncStorage.getItem('@session_id');
  const token = await AsyncStorage.getItem('@session_token');
  console.log(user_id);
  return fetch("http://localhost:3333/api/1.0.0/user/"+ user_id, { //get the user information from the server in aysnc storage
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
      userDetails:responseJson
    });
  }) 
  .catch((error) => { //any other response prints the error to the console 
    console.log(error); 
  });
};


  render() { //renders the friends profile page 
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
                  borderWidth: 0,
                  }}
                />
                {/* display the image of the friend and their detials like name and friends count */}


                <Text style={styles.post2}> FRIEND NAME: {this.state.userDetails.first_name} {this.state.userDetails.last_name}</Text>
                <Text style={styles.post3}> FRIEND COUNT: {this.state.userDetails.friend_count}</Text>

                  {/* user (who ain't the friend) can post on the friend wall and the post the wall */}
        <TextInput placeholder = 'Enter Your Post On Friend Wall:'
            style={{fontSize: 25, backgroundColor: '#ffffff',textAlign:'center',
            marginLeft: 10,marginRight:10, marginTop: 25, marginBottom:10, borderWidth: 2}}
            onChangeText={value => this.setState({post: value})}
            value={this.state.post}/>

        <TouchableOpacity>
          <Text onPress={() => this.newPostFriends()} style={styles.post} > ADD NEW POST </Text>
        </TouchableOpacity>


        {/* the FlatList uses post data and the fucntion passed in the item which determaines who posted what on the wall and will seperate in accordance */}
        <FlatList
          data={this.state.postData}
          renderItem={({item}) =>(this.displayPost(item))}
          keyExtractor={(item,index)=> item.post_id.toString()}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({ //style sheet for the friends profile page
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
  },
  post2 : {
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginBottom:0,
    marginLeft:100,
    marginTop:-70,
  },
  post3 : {
    fontSize:20,
    fontfamily:"lucida grande",
    color: "#fffcfa",
    marginBottom:0,
    marginLeft:100,
  },

});
export default FriendProfileWall;



