import React, { Component } from 'react';
import { Text, View, Button, StyleSheet} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Draft extends Component {



    render() {




        return (      
            <View style={styles.background}>
              <Text style={styles.profileTitle}> Draft Page  </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title:{
      fontSize:65,
      fontfamily:"lucida grande",
      color: "#fffcfa"
  },
    background : {
        backgroundColor: '#4267B2',
        flex : 1,
    },
    profileTitle:{
      fontSize:35,
      fontfamily:"lucida grande",
      color: "#fffcfa",
      marginLeft: 90
    }
})
export default Draft