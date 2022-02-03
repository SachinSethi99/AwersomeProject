// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Bruno, Bruno, Bruno, 
//             He’s from Sporting like Cristiano, 
//             He goes left, 
//             He goes right, 
//             He makes the defences look shi*e, 
//             He’s our Portuguese magnifico.</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

class lab2Week extends Component{

  constructor(props){
    super(props);

    this.state = {
      items: [],
      temp_item: ""
    }
  }

  addItemToList = () => {
    let newItems = this.state.items.concat(this.state.temp_item);
    this.setState({
      items: newItems,
      temp_item: ""
    });
  }

  remove = (index) => {
    console.log(index);
    let newList = this.state.items;
    newList.splice(index, 1);
    this.setState({items: newList});
  }

  render(){
    return (
      <View>
        <TextInput
          placeholder='Add to list'
          onChangeText={value => this.setState({temp_item: value})}
          value={this.state.temp_item}
        />
        <Button 
          onPress={() => {
            this.addItemToList();
          }}
          title="Add"
        />

        <FlatList
          data={this.state.items}
          renderItem={({item, index}) => 
            <View>
              <Text>{item}</Text>
              <Button
                onPress={() => this.remove(index)}
                title="Done"
              />
            </View>
          }
        />
      </View>
    )
  }


}

export default lab2Week;





// class SayHello extends Component {
//   render(){
//     return (
//       <View>
//         <Text>Hello {this.props.name}</Text>
//       </View>
//     )
//   };
// }

// class HelloWorldApp extends Component {
//   render(){
//     return (
//       <View>
//         <SayHello name="Ash" />
//       </View>
//     );
//   }
// }

// // class HelloWorldApp extends Component {
// //   render(){

// //     let name = "Ash";

// //     return (
// //         <View>
// //           <Text>Hello {name}</Text>
// //         </View>
// //     );
// //   }
// // }export default HelloWorldApp


