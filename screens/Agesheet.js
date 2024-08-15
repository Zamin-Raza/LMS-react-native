import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

const Agesheet = () => {
  const [studentRecords, setStudentRecords] = useState([]);

  useEffect(() => {
    fetchAges();
  }, []);

  const fetchAges = async () => {
    try {
      const snapshot = await firestore().collection('Student').get();
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        reg: doc.data().registrationNumber,
        Name: doc.data().Name,
        Fname: doc.data().father_details.fatherName,
        DOB: doc.data().dateOfBirth.toDate()
      }));

      const currentDate = new Date();
      const recordsWithAge = records.map(record => {
        const dob = record.DOB;
        let ageYears = currentDate.getFullYear() - dob.getFullYear();
        let ageMonths = currentDate.getMonth() - dob.getMonth();
      
        // Adjust the age in years and months if necessary
        if (ageMonths < 0) {
          ageYears--;
          ageMonths += 12;
        }
      
        return { ...record, age: `${ageYears} years and ${ageMonths} months` };
       
      });

      setStudentRecords(recordsWithAge);
    } catch (error) {
      console.error('Error fetching student records:', error);
    }
  };

  const generatePDF = async () => {
    let htmlContent = `
      <h1>Student Records</h1>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <tr>
          <th>Registration Number</th>
          <th>Name</th>
          <th>Father's Name</th>
          <th>Age</th>
          <th>Date Of Birth</th>
        </tr>
    `;

    studentRecords.forEach(record => {
      htmlContent += `
        <tr>
          <td>${record.reg}</td>
          <td>${record.Name}</td>
          <td>${record.Fname}</td>
          <td>${record.age}</td>
          <td>${record.DOB.toLocaleDateString()}</td>
        </tr>
      `;
    });

    htmlContent += `</table>`;

    try {
      const options = {
        html: htmlContent,
        fileName: 'StudentRecords',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);

      // Optionally, you can share or open the file here using react-native-share or any other library
      alert(`PDF saved to ${file.filePath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
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
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.Fname}</Text>
      </View>
     
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.DOB.toLocaleDateString()}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.age}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Download PDF" onPress={generatePDF} />
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Registration Number</Text>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Father's Name</Text>
        <Text style={styles.headerCell}>Date Of Birth</Text>
        <Text style={styles.headerCell}>Age</Text>
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
});

export default Agesheet;
