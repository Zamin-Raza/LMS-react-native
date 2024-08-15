import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const Viewmarks = ({ navigation, route }) => {
  const { myclass, flag, stdId } = route.params; // Destructure the new params
  const [studentRecords, setStudentRecords] = useState([]);
  const [classRecord, setClassRecord] = useState([]);
  const [marks, setMarks] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [fetchedMarks, setFetchedMarks] = useState(null);
  const Exam = ['First_Term', 'Mid-Term', 'Final-Term'];
  const [TotalMarks, setTotalMarks] = useState([]);
  const [showDetailedMarks, setShowDetailedMarks] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    fetchStd();
    if (!flag) {
      setSelectedStudent(stdId); // Set the student ID if flag is false
    }
  }, []);

  const fetchStd = async () => {
    try {
      const studentSnapshot = await firestore().collection('Student').where("admissionClass", "==", myclass).get();
      const students = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        reg: doc.data().registrationNumber,
        Name: doc.data().Name,
        Class: doc.data().AdmissionClass,
      }));
      setStudentRecords(students);

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

  const viewAllMarks = async () => {
    try {
      const marksDoc = await firestore().collection('Marks').doc(myclass).get();
      if (marksDoc.exists) {
        const marksData = marksDoc.data();
        let sum = [0, 0, 0, 0]; // 3 for separate exam types and 1 for cumulative total
        Exam.forEach((examType, index) => {
          const examData = marksData[examType];
          if (examData) {
            Object.keys(examData).forEach(subject => {
              const subjectData = examData[subject];
              if (subjectData.studentId === selectedStudent) {
                sum[index] += parseInt(subjectData.marks, 10);
                sum[3] += parseInt(subjectData.marks, 10); // Adding to cumulative total
              }
            });
          }
        });
        setTotalMarks(sum);
        setShowDetailedMarks(true);
      } else {
        setTotalMarks('No marks document found.');
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const viewMarks = async () => {
    try {
      const marksDoc = await firestore().collection('Marks').doc(myclass).get();
      console.log("mera doc" + marksDoc);
      if (marksDoc.exists) {
        const examData = marksDoc.data()[selectedExam];
        if (examData && examData[selectedSubject]) {
          const subjectData = examData[selectedSubject];
          if (subjectData.studentId === selectedStudent) {
            setFetchedMarks(subjectData.marks);
          } else {
            setFetchedMarks('No marks found for the selected student.');
          }
        } else {
          setFetchedMarks('No data found for the selected exam and subject.');
        }
      } else {
        setFetchedMarks('No marks document found.');
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
      return fetchedMarks;
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={viewMarks}>
          <Text style={styles.buttonText}>View Marks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={viewAllMarks}>
          <Text style={styles.buttonText}>View Total</Text>
        </TouchableOpacity>
      </View>
      {fetchedMarks !== null && (
        <View style={styles.marksContainer}>
          <Text style={styles.marksText}>Marks: {fetchedMarks}</Text>
        </View>
      )}
      {showDetailedMarks && (
        <View style={styles.marksContainer}>
          <Text style={styles.marksText}>First Term Marks: {TotalMarks[0]}</Text>
          <Text style={styles.marksText}>Mid Term Marks: {TotalMarks[1]}</Text>
          <Text style={styles.marksText}>Final Term Marks: {TotalMarks[2]}</Text>
          <Text style={styles.marksText}>Cumulative Total Marks: {TotalMarks[3]}</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#28C2A0',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
    alignItems: 'center',
    width: "40%",
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  marksContainer: {
    marginTop: 20,
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  marksText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default Viewmarks;
