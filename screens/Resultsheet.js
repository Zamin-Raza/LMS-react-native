import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const Resultsheet = () => {
  const [marksData, setMarksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const ExamType = ['First_Term', 'Mid-Term', 'Final-Term'];

  useEffect(() => {
    fetchMarksData();
  }, []);

  const fetchMarksData = async () => {
    try {
      console.log('Fetching marks data');
      const marksSnapshot = await firestore().collection('Marks').get();
      const data = marksSnapshot.docs.map(doc => ({
        className: doc.id,
        ...doc.data(),
      }));
      setMarksData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching marks data:', error);
      Alert.alert('Error fetching marks data');
    }
  };

  const generatePDF = async () => {
    let htmlContent = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; color: #333; }
        .marks-record { border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 10px 0; }
        .marks-record h2 { margin: 0 0 10px; }
        .marks-record p { margin: 5px 0; }
      </style>
      <h1>Student Marks</h1>
    `;

    marksData.forEach(record => {
      htmlContent += `
        <div class="marks-record">
          <h2>Class: ${record.className}</h2>
      `;

      ExamType.forEach(term => {
        if (record[term]) {
          htmlContent += `<h3>${term}</h3>`;
          Object.keys(record[term]).forEach(subject => {
            const subjectData = record[term][subject];
            htmlContent += `<p><strong>Subject: ${subject}</strong></p>`;
            htmlContent += `
              <p>Student ID: ${subjectData.studentId}, Marks: ${subjectData.marks}</p>
            `;
          });
        }
      });

      htmlContent += `</div>`;
    });

    try {
      const options = {
        html: htmlContent,
        fileName: 'StudentMarks',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);

      Alert.alert(`PDF saved to ${file.filePath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error generating PDF');
    }
  };

  const renderRecordItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Class: {item.className}</Text>
      {ExamType.map(term => (
        item[term] && (
          <View key={term}>
            <Text style={styles.termTitle}>{term}</Text>
            {Object.keys(item[term]).map(subject => {
              const subjectData = item[term][subject];
              return (
                <View key={subject}>
                  <Text style={styles.subjectTitle}>Subject: {subject}</Text>
                  <Text style={styles.recordText}>
                    Student ID: {subjectData.studentId}, Marks: {subjectData.marks}
                  </Text>
                </View>
              );
            })}
          </View>
        )
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Download PDF" onPress={generatePDF} />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={marksData}
          renderItem={renderRecordItem}
          keyExtractor={(item, index) => `${item.className}_${index}`}
        />
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  termTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subjectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  recordText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
  },
});

export default Resultsheet;
