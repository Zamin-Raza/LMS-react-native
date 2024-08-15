import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const Marks = ({navigation,route}) => {
  const {myclass} = route.params ;
  const [studentRecords, setStudentRecords] = useState([]);
  const [classRecord, setClassRecord] = useState([]);
  const [marks, setMarks] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const Exam = ['First_Term','Mid-Term', 'Final-Term'];

  useEffect(() => {
    fetchStd();
  }, []);

  const fetchStd = async () => {
    try {
      console.log("my fucntion")
      console.log(myclass);
      console.log(typeof(myclass));
      try{
      const studentSnapshot = await firestore().collection('Student').where("admissionClass", "==", myclass).get();

      console.log(studentSnapshot.docs);
      

      if(studentSnapshot){
        console.log('ye chala hashash');
      const students = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        reg: doc.data().registrationNumber,
        Name: doc.data().Name,
        Class: doc.data().AdmissionClass,
      }));
      setStudentRecords(students);
    }
  }
  catch(e){
    console.log(e);
  }

      const classSnapshot = await firestore().collection('Class').where('Class', "==", myclass).get();
      const classes = classSnapshot.docs.map(doc => ({
        id: doc.id,
        Subjects: doc.data().Subject,
      }));
      setClassRecord(classes[0] ? classes[0].Subjects : []);
    } catch (error) {
      console.error('Error fetching student records:', error);
    }
  };

  const addMarks = async (item) => {
    if (!selectedExam || !selectedSubject || !marks) {
      console.error('Please select exam type, subject, and enter marks');
      return;
    }

    try {
      const docId = item.Class;  // Document ID is the class of the student
      const marksRef = firestore().collection('Marks').doc(myclass);

      const marksData = {
        [selectedExam]: {
            [selectedSubject]:{
                studentId: item.reg,
                marks: marks,
            }
        }
      };

      await marksRef.set(marksData, { merge: true });
      setMarks('');
    } catch (error) {
      console.error('Error adding marks:', error);
    }
  };

  const renderRecordItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.reg}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.Name}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={marks}
        onChangeText={setMarks}
        placeholder='Enter Marks'
      />
      <TouchableOpacity style={styles.button} onPress={() => addMarks(item)}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedExam}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedExam(itemValue)}
      >
        <Picker.Item label="Select Exam" value="" />
        {Exam.map((exam, index) => (
          <Picker.Item key={index} label={exam} value={exam} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedSubject}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedSubject(itemValue)}
      >
        <Picker.Item label="Select Subject" value="" />
        {classRecord.map((subject, index) => (
          <Picker.Item key={index} label={subject} value={subject} />
        ))}
      </Picker>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Registration Number</Text>
        <Text style={styles.headerCell}>Name</Text>
      </View>
      <FlatList
        data={studentRecords}
        renderItem={renderRecordItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F0F4F8',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#28C2A0',
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: '#28C2A0',
    borderRadius: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#333333',
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  picker: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#28C2A0',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default Marks;
