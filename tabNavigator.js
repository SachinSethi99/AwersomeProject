/* eslint-disable linebreak-style */
// imported the pages to be used on the tab
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfilePage from './ProfilePage';
import followerPage from './viewFriendsPage';
import requestfriends from './FriendsRequest';
import editProfileDetails from './UpdateProfileDetails';
import Draft from './DraftPage';
import FriendPages from './SearchFriendsPage';

const Tab = createBottomTabNavigator(); // created the tab navigator

function MyTabs() { // tabs shown at the bottom of the page to navaigate through the app
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile Page" component={ProfilePage} />
      <Tab.Screen name="Search Friends" component={FriendPages} />
      <Tab.Screen name="Draft Page" component={Draft} />
      <Tab.Screen name="Outstanding Requests" component={followerPage} />
      <Tab.Screen name="Send Friend Request" component={requestfriends} />
      <Tab.Screen name="Setthings" component={editProfileDetails} />
    </Tab.Navigator>
  );
}
export default MyTabs;
