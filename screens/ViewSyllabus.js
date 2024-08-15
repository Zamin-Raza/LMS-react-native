import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
// import { useRoute } from '@react-navigation/native';

const ViewSyllabus = ({navigarion , route}) => {
  
  const {viewtimetable , myclass}= route.params;
  
 
   // Get the initial value from the route parameters

  
  const [subjectsRecord, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    console.log(myclass)
    console.log({viewtimetable});
    // console.log((JSON.stringify(myclass))+ "we are going to check");
    try {
      console.log('Fetching data');
      const classSnapshot = await firestore().collection('Class').where('Class', '==', myclass).get();
      console.log(classSnapshot.docs[0].data());
      const subjectsArray = classSnapshot.docs[0].data().Subject;
      setSubjects(subjectsArray);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      Alert.alert('Error fetching subjects');
    }
  };

  const displayTimetable = async () => {
    if (myclass) {
      console.log(myclass);
      const val = myclass;
      console.log(val + "  "+ typeof(val))
      console.log(typeof(myclass));
      try {
        const doc = await firestore().collection('Timetable').doc(val).get();
        if (doc.exists) {
          console.log("hn g mil gya")
          setDownloadUrl(doc.data().imageUrl);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching timetable:', error);
        Alert.alert('Error fetching timetable');
      }
    } else {
      console.log('Please enter a class name');
    }
  };

  const displaySyllabus = async () => {
    if (className && selectedSubject) {
      try {
        const doc = await firestore().collection('Syllabus').doc(`${className}_${selectedSubject}`).get();
        if (doc.exists) {
          setDownloadUrl(doc.data().imageUrl);
        } else {
          Alert.alert('No such document!');
        }
      } catch (error) {
        console.error('Error fetching syllabus:', error);
        Alert.alert('Error fetching syllabus');
      }
    } else {
      Alert.alert('Please select a class name and subject');
    }
  };

  return (
    <View>
    <View style={styles.circle1}></View>
    <ScrollView style={styles.container}>
      
      <Text style={styles.title}>{viewtimetable ? 'View Timetable' : 'View Syllabus'}</Text>
      {viewtimetable ? (
        <View>
          <TouchableOpacity style={styles.button} onPress={displayTimetable}>
            <Text style={styles.buttonText}>Load Timetable</Text>
          </TouchableOpacity>
          {downloadUrl ? (
            <Image
              source={{ uri: downloadUrl }}
              style={styles.syllabusImage}
              resizeMode="contain"
            />
          ) : null}
        </View>
      ) : (
        <View>
          <Picker
            selectedValue={selectedSubject}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          >
            <Picker.Item label="Select Subject" value={null} />
            {subjectsRecord.map((subject, index) => (
              <Picker.Item key={index} label={subject} value={subject} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={displaySyllabus}>
            <Text style={styles.buttonText}>View Syllabus</Text>
          </TouchableOpacity>
          {downloadUrl ? (
            <Image
              source={{ uri: downloadUrl }}
              style={styles.syllabusImage}
              resizeMode="contain"
            />
          ) : null}
        </View>
      )}
    </ScrollView>
    <View style={styles.circle2}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle1:{
    // position:'absolute',
    width:150,
    height:150,
    borderRadius:100,
    backgroundColor:'#28C2A0',
   top:-90,
   left:-50,
   },
   circle2:{
    marginVertical:-50,
    position:'fix',
    width:150,
    height:140,
    borderRadius:100,
  backgroundColor:'#0C46C4',
  bottom:-450,
  right:-300,

  },
  container: {
    // flex: 1,
    // paddingBottom: -30,
    marginTop:-90,
    paddingHorizontal: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    textShadowColor: 'grey',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 15,
  },
  picker: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#28C2A0',
    padding: 10,
    borderRadius: 15,
    marginVertical: 20,
    alignItems: 'center',
  
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  syllabusImage: {
    width: '100%',
    height: 400,
    marginVertical: 20,
  },
});

export default ViewSyllabus;
