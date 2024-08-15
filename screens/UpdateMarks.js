import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-paper';

const UpdateMarks = ({ navigation, route }) => {
  const { myclass, flag, stdId } = route.params;
  const [studentRecords, setStudentRecords] = useState([]);
  const [classRecord, setClassRecord] = useState([]);
  const [marks, setMarks] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [fetchedMarks, setFetchedMarks] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(stdId);
  const Exam = ['First_Term', 'Mid-Term', 'Final-Term'];

  useEffect(() => {
    fetchStd();
  }, []);

  useEffect(() => {
    if (selectedExam && selectedSubject && selectedStudent) {
      viewMarks();
    }
  }, [selectedExam, selectedSubject, selectedStudent]);

  const fetchStd = async () => {
    try {
      const studentSnapshot = await firestore().collection('Student').where('admissionClass', '==', myclass).get();
      const students = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        reg: doc.data().registrationNumber,
        Name: doc.data().Name,
        Class: doc.data().AdmissionClass,
      }));
      setStudentRecords(students);

      const classSnapshot = await firestore().collection('Class').where('Class', '==', myclass).get();
      const classes = classSnapshot.docs.map(doc => ({
        id: doc.id,
        Subjects: doc.data().Subject,
      }));
      setClassRecord(classes[0] ? classes[0].Subjects : []);
    } catch (error) {
      console.error('Error fetching student records:', error);
    }
  };

  const viewMarks = async () => {
    console.log("marks abhi ajain gy na");
    console.log(myclass + typeof(myclass));
    try {
      const marksDoc = await firestore().collection('Marks').doc(myclass).get();
      console.log(marksDoc.docs);
      if (marksDoc.exists) {
        const examData = marksDoc.data()[selectedExam];
        if (examData && examData[selectedSubject]) {
          const subjectData = examData[selectedSubject][selectedStudent];
          if (subjectData) {
            console.log("ye cheez");
            setFetchedMarks(subjectData.marks);
            setMarks(subjectData.marks);
            console.log(marks + "i got these");
            console.log(typeof(marks));
          } else {
            setFetchedMarks('No marks found for the selected student.');
            setMarks('');
          }
        } else {
          setFetchedMarks('No data found for the selected exam and subject.');
          setMarks('');
        }
      } else {
        setFetchedMarks('No marks document found.');
        setMarks('');
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
      setFetchedMarks('Error fetching marks.');
      setMarks('');
    }
  };

  const updateMarks = async () => {
    if (!selectedExam || !selectedSubject || !marks) {
      Alert.alert('Please select exam type, subject, and enter marks');
      return;
    }

    try {
      const marksRef = firestore().collection('Marks').doc(myclass);
      const marksData = {
        [selectedExam]: {
          [selectedSubject]: {
            [selectedStudent]: {
              studentId: selectedStudent,
              marks: marks
            },
          },
        },
      };

      await marksRef.set(marksData, { merge: true });
      Alert.alert('Marks updated successfully');
    } catch (error) {
      console.error('Error updating marks:', error);
      Alert.alert('Error updating marks');
    }
  };

  return (
    <View style={styles.container}>
      {flag && (
        <Picker
          selectedValue={selectedStudent}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedStudent(itemValue)}
        >
          <Picker.Item label="Select Student" value="" />
          {studentRecords.map((student, index) => (
            <Picker.Item key={index} label={"Reg No: " + student.reg + " " + student.Name} value={student.id} />
          ))}
        </Picker>
      )}
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
      {fetchedMarks !== null && (
        <View style={styles.marksContainer}>
          <TextInput
            style={styles.input}
            value={marks}
            onChangeText={setMarks}
            
          />
          <TouchableOpacity style={styles.button} onPress={updateMarks}>
            <Text style={styles.buttonText}>Update Marks</Text>
          </TouchableOpacity>
        </View>
      )}
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
  picker: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: '#28C2A0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  marksContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default UpdateMarks;
