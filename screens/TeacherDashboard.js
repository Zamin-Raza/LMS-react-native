import React, { useState , useEffect } from 'react';
import { View, StyleSheet, Text, Image , Alert } from 'react-native';
import CustomButton from '../components/CustomButton'; // Import the CustomButton component
import { useNavigation , useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const TeacherDashboard = ({navigation , route}) => {
  const {Email} = route.params;
  
  // const { email } = route.params;

  

 const [teacher_class, setteacher_class] = useState('');


  const fetchClass = async () => {
    try {
      // Normalize the email
     console.log(JSON.stringify(Email).slice(1, -1) + " is going to be matched with data base")
      const mydata = await firestore()
        .collection('Teacher')
        .where('TeacherEmail', '==', (JSON.stringify(Email).trim().slice(1, -1)))
        .get();

      if (!mydata.empty) {
        const Teach_Class = mydata.docs[0].data().TeacherClass;
        console.log('Class found:', Teach_Class);
        setteacher_class(Teach_Class);
        console.log("class is "+teacher_class);
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
    
  },);


  
  const handleViewMarks = () => {
    navigation.navigate('Viewmarks' , {'myclass' : teacher_class , 'flag' : true});
    // Logic for viewing marks
  };

  const handleSearch= () => {
   
    // Logic for searching marks
  };

  const handleInsertMarks = () => {
    navigation.navigate('Marks', {'myclass' : teacher_class});
    // Logic for inserting marks
  };

  const handleUpdateMarks = () => {

    navigation.navigate('UpdateMarks',{'myclass':teacher_class , 'flag' : true});
    // Logic for updating marks
  };

  const handleDeleteMarks = () => {
    navigation.navigate('DeleteMarks',{'myclass':teacher_class , 'flag' : true});
    // Logic for deleting marks
  };

  return (
    <View style={styles.container}>
        <View style={styles.circle1}></View>
      <Text style={styles.title}>Teacher Dashboard</Text>
      
      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download8.png')} style={styles.icon} />
          <CustomButton title="View Marks" onPress={handleViewMarks} />
        </View>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download9.png')} style={styles.icon} />
          <CustomButton title="Search " onPress={handleSearch} />
        </View>
      </View>
      
      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download10.png')} style={styles.icon} />
          <CustomButton title="Insert          Marks" onPress={handleInsertMarks} />
        </View>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download11.png')} style={styles.icon} />
          <CustomButton  title="Update Marks" onPress={handleUpdateMarks} />
        </View>
      </View>
      
      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Image source={require('../pics/download12.png')} style={styles.icon} />
          <CustomButton title="Delete Marks" onPress={handleDeleteMarks} />
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
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',  
    textShadowColor: '#000', 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 4, 
    letterSpacing: 2, 
    textAlign: 'center', 
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
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});

export default TeacherDashboard;
