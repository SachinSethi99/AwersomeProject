import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ImagePickerIOS } from 'react-native';
import ProfilePage from './ProfilePage';
import followerPage from './viewFriendsPage';
import LogOutPage from './LogOutPage';
import requestfriends from './FriendsRequest';
import editProfileDetails from './UpdateProfileDetails';
import Draft from './DraftPage';
import FriendPages from './SearchFriendsPage';
const Tab = createBottomTabNavigator();

  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Profile Page" component={ProfilePage} />
         <Tab.Screen name = "Search for Friends" component={FriendPages} /> 
         <Tab.Screen name="Draft Page" component={Draft} />
        <Tab.Screen name="Outstanding Requests" component={followerPage} />
        <Tab.Screen name="Send Friend Request" component={requestfriends} />
        <Tab.Screen name="Prfile Edit" component={editProfileDetails} />
        {/* <Tab.Screen name = "Search for Friends" component={LogOutPage} /> */}
      </Tab.Navigator>
    );
  }

  export default MyTabs;