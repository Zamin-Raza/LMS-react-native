import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login'; // Assuming your Login component is in Login.js
// import Home from './screens/Home'; // Assuming your Home component is in Home.js
import Crud from './screens/Crud'; // Assuming your Home component is in Crud.js
import viewstd from './screens/Viewstd'; // Assuming your Home component is in Crud.js
import CustomTextInput from './screens/CustomTextInput'; // Assuming your Home component is in Custom.js
import ImageUploadScreen from './screens/ImageUploadScreen'; // Assuming your Home component is in Custom.js
import Accounts from './screens/Accounts'; // Assuming your Home component is in Custom.js

import Admin from './screens/Admin'; // Assuming your Home component is in Crud.js
import Addfee from './screens/Addfee'; // Assuming your Home component is in Crud.js
import Agesheet from './screens/Agesheet'; // Assuming your Home component is in Crud.js
import Marks from './screens/Marks';
import Resultsheet from './screens/Resultsheet';
import Uploadsyllabus from './screens/Uploadsyllabus';
import Viewmarks from './screens/Viewmarks';
import AdminDashboard from './screens/AdminDashboard';
import TeacherDashboard from './screens/TeacherDashboard';
import StudentDashboard from './screens/StudentDashboard';
import Feewview from './screens/Feeview';
import ViewSyllabus from './screens/ViewSyllabus';
import Home from './screens/Home';
import DeleteMarks from './screens/DeleteMarks';
import Loginacc from './screens/Loginacc';

import UpdateMarks from './screens/UpdateMarks';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* <Stack.Screen name="Home" component={Home} /> */}
       
        <Stack.Screen name="viewstd" component={viewstd} />
        <Stack.Screen name="Loginacc" component={Loginacc} />
        <Stack.Screen name="DeleteMarks" component={DeleteMarks} />
        <Stack.Screen name="ViewSyllabus" component={ViewSyllabus} />
        <Stack.Screen name="Feeview" component={Feewview} />
        <Stack.Screen name="Viewmarks" component={Viewmarks} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="UpdateMarks" component={UpdateMarks} />
 
        <Stack.Screen name="Resultsheet" component={Resultsheet} />
        <Stack.Screen name="Uploadsyllabus" component={Uploadsyllabus} />
        <Stack.Screen name="Marks" component={Marks} />
        <Stack.Screen name="Crud" component={Crud} />
        <Stack.Screen name="Agesheet" component={Agesheet} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Accounts" component={Accounts} />
        <Stack.Screen name="Addfee" component={Addfee} />
        <Stack.Screen name="ImageUploadScreen" component={ImageUploadScreen} />
    
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
