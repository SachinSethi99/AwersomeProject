/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      postData: []
    };
  }

  // get users list of post
  getData = async () => {

    let { user_id} = this.props.route.params;

    const token = await AsyncStorage.getItem('@session_token');
    //const id = await AsyncStorage.getItem('@session_id');

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
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
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

  // get users profile pic
  // get list of posts for give user
  // view single post

  // add post

  // delete

  // update

  // like post
  addLike = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
    return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post/${post_id}/like", {
      method: 'POST',
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

  // remove like
  removeLike = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const session_token = await AsyncStorage.getItem('@session_token');
    // const post_id = await AsyncStorage.getItem(post_id);
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

  render() {
    return (

      <View style={styles.background}>
        <Text style={styles.title}> SPACEBOOK </Text>
        <Text style={styles.profileTitle}>Friends Profile</Text>
        <FlatList
            data={this.state.postData}
            renderItem={({item}) => (
                <View>
                    <Text>{item.text}</Text>
                </View>
            )}
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
  },
  profileTitle2: {
    fontSize: 20,
    fontfamily: 'lucida grande',
    color: '#fffcfa',
    marginLeft: 10,

  },

});
export default FriendProfileWall;
