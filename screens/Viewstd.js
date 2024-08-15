import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Viewstd = () => {
  const [studentRecords, setStudentRecords] = useState([]);

  useEffect(() => {
    viewRecords();
  }, []);

  const viewRecords = async () => {
    console.log("Function started");
    try {
      console.log("Fetching data");
      const snapshot = await firestore().collection('Student').get();
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudentRecords(records);
    } catch (err) {
      console.log(err);
      Alert.alert("Error fetching data");
    }
  };

  const editRecord = (id) => {
    // Implement your edit functionality here
    console.log(`Edit record with id: ${id}`);
  };

  const deleteRecord = async (id) => {
    try {
      await firestore().collection('Student').doc(id).delete();
      Alert.alert("Record deleted successfully");
      viewRecords(); // Refresh the records after deletion
    } catch (err) {
      console.log(err);
      Alert.alert("Error deleting record");
    }
  };

  const renderRecordItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.registrationNumber}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.Name}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.father_details.fatherName}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.dateOfBirth.toDate().toLocaleDateString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
      
        <TouchableOpacity style={styles.editButton} onPress={() => editRecord(item.id)}>
          <Text>Edit</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecord(item.id)}>
        <Text>Delete</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Registration Number</Text>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Father's Name</Text>
        <Text style={styles.headerCell}>Date Of Birth</Text>
        <Text style={styles.headerCell}>Actions</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFD700',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Viewstd;
