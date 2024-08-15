import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Text, Image , Alert } from 'react-native';
import CustomButton from '../components/CustomButton'; // Import the CustomButton component
import { useNavigation , useRoute} from '@react-navigation/native';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const StudentDashboard = ({navigation,route}) => {

  const {Email} = route.params;
  const [myEmail , setEmail2] = useState(JSON.stringify(Email));

  const [email, setEmail] = useState(route.params?.email || '')
 
  const [Student_class , setStd_class] = useState('');
  const [S_id , setS_id] = useState('');


  const check = ()=>{
    console.log({Email});
    console.log(JSON.stringify(Email));
    console.log(typeof({Email}));
    console.log(typeof(Email));

  }
 

  const fetchClass = async () => {
    try {
     
    console.log(JSON.stringify(Email) + "will be matched");
    console.log(typeof(JSON.stringify(Email)));

    console.log('zamin');
    
    
      //ye object de raha
     

      const mydata = await firestore()
        .collection('Student')
        .where('email', '==', (JSON.stringify(Email).trim().slice(1, -1)))
        .get();

      if (!mydata.empty) {
        const Std_Class = mydata.docs[0].data().admissionClass;
        const Std_ID = mydata.docs[0].data().registrationNumber;
        console.log('Class found:', Std_Class);
      setStd_class(Std_Class);
      setS_id(Std_ID);
      console.log(Student_class);
      console.log(S_id);

      } else {
        console.log('No matching documents found.');
        
      }
    } catch (e) {
      console.error(e);
      
      Alert.alert("Error", "Failed to fetch class information.");
    }
  };

  useEffect(() => {
    
      fetchClass();
    
  });

  const handleViewMarks = () => {
navigation.navigate("Viewmarks",{'myclass':Student_class , 'flag': false , 'stdId' : S_id});
  
  };

  const handleViewPreviousYears = () => {
    // Logic for viewing previous years' records
  };

  const handleViewFeeStatus = () => {

    navigation.navigate("Feeview");
    // Logic for viewing fee status
  };

  const handleViewTimetable = () => {
    console.log(Student_class + "going on next screen");
    navigation.navigate('ViewSyllabus',{'viewtimetable' : true , 'myclass' : Student_class});
    // Logic for viewing timetable
  };

  const handleViewSyllabus = () => {
    navigation.navigate('ViewSyllabus', {'viewtimetable' : false , 'myclass': Student_class})
    // Logic for viewing syllabus
  };

  return (
    <View style={styles.container}>
         <View style={styles.circle1}></View>
      <Text style={styles.title}>Student Dashboard</Text>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download13.png')} style={styles.icon} />
          <CustomButton title="View        Marks" onPress={handleViewMarks} />
        </View>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download14.png')} style={styles.icon} />
          <CustomButton title="Previous Years" onPress={handleViewPreviousYears} />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download3.png')} style={styles.icon} />
          <CustomButton title="View Fee Status" onPress={handleViewFeeStatus} />
        </View>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download5.png')} style={styles.icon} />
          <CustomButton title="View Timetable" onPress={handleViewTimetable} />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download7.png')} style={styles.icon} />
          <CustomButton title="View Syllabus" onPress={handleViewSyllabus} />
        </View>
      </View>
      <View style={styles.circle2}></View>
    </View>
  );
};

const styles = StyleSheet.create({
    circle1:{
        position:'absolute',
        width:200,
        height:200,
        borderRadius:100,
        backgroundColor:'#28C2A0',
       top:-110,
       left:-50,
       },
       circle2:{
         marginVertical:-50,
         position:'absolute',
         width:200,
         height:200,
         borderRadius:100,
       backgroundColor:'#0C46C4',
       bottom:-60,
       right:-50,
     
       },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Light background color
    padding: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0C46C4', // Dark text color
    textShadowColor: '#000', // Black shadow
   
    textShadowRadius: 4, // Shadow blur
    letterSpacing: 2, // Space between letters
    textAlign: 'center', // Center align text
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  icon: {
    width: 45,
    height: 40,
    marginBottom: 10,
  },
});

export default StudentDashboard;
