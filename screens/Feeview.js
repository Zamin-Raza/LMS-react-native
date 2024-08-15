import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Feewview = () => {
  const Myid = '0';  
  const [studentRecord, setStudentRecord] = useState(null);

  useEffect(() => {
    viewRecords();
  }, []);

  const viewRecords = async () => {
    console.log("Function started");
    try {
      console.log("Fetching data");
      const snapshot = await firestore().collection('Fees').doc(Myid).get();
      if (snapshot.exists) {
        const record = {
          id: snapshot.id,
          ...snapshot.data(),
        };
        setStudentRecord(record);
        console.log(record);
      } else {
        Alert.alert("No data found");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error fetching data");
    }
  };

  const renderRecordItem = () => {
    if (!studentRecord) return null;
    
    return (
      <View style={styles.recordBox}>
        {Object.keys(studentRecord).map((key) => (
          key !== 'id' && (
            <View key={key} style={styles.recordRow}>
              <Text style={styles.recordKey}>{key.replace(/_/g, ' ')}:</Text>
              <Text style={styles.recordValue}>{studentRecord[key]}</Text>
            </View>
          )
        ))}
      </View>
    );
  };

  return (
    <View>
    <View style={styles.circle1}></View>
    <ScrollView style={styles.container}>
    
      <Text style={styles.title}>Student Fee Details</Text>
      {renderRecordItem()}
      
    </ScrollView>
    <View style={styles.circle2}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle1:{
    // position:'absolute',
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
   bottom:-240,
   right:-50,
 
   },
  container: {
    // flex: 1,
  marginTop:-50,
    // paddingHorizontal: 20,
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
  recordBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
    transform: [{ perspective: 1000 }, { rotateX: '10deg' }],
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  recordKey: {
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
    flex: 1,
    fontSize: 16,
  },
  recordValue: {
    color: '#555',
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
  },
});

export default Feewview;
