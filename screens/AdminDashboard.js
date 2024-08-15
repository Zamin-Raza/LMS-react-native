import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton'; // Adjust the import path as necessary

const AdminDashboard = ({ navigation, route }) => {

  const handleAssignClass = () => {
    navigation.navigate('Accounts');
  };

  const handleCreateStudentAccount = () => {
    navigation.navigate('Crud');
  };

  const handleManageFeeStatus = () => {
    navigation.navigate('Addfee');
  };

  const handleViewReports = () => {
    navigation.navigate('Agesheet');
  };

  const handleUploadTimetable = () => {
    navigation.navigate('ImageUploadScreen');
  };

  const handleUploadSyllabus = () => {
    navigation.navigate('Uploadsyllabus');
  };

  const handleDownloadReports = () => {
    navigation.navigate('Resultsheet');
    // Logic for downloading reports
  };
  
  const handleView = () => {
    navigation.navigate('viewstd');
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.circle1}></View>
        <Text style={styles.title}>Admin Dashboard</Text>
        <View style={styles.buttonRow}>
          <View style={styles.buttonContainer}>
            <Image source={require('../pics/download.png')} style={styles.icon} />
            <CustomButton title="Assign/Remove Class" onPress={handleAssignClass} />
          </View>
          <View style={styles.buttonContainer}>
            <Image source={require('../pics/download2.png')} style={styles.icon} />
            <CustomButton title="Create Student Account" onPress={handleCreateStudentAccount} />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttonContainer}>
            <Image source={require('../pics/download7.png')} style={styles.icon} />
            <CustomButton title="View Students" onPress={handleView} />
          </View>
          <View style={styles.buttonContainer}>
            <Image source={require('../pics/download3.png')} style={styles.icon} />
            <CustomButton title="Manage Fee Status" onPress={handleManageFeeStatus} />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttonContainer}>
            <Image source={require('../pics/download4.png')} style={styles.icon} />
            <CustomButton title="View Reports" onPress={handleViewReports} />
          </View>
          <View style={styles.buttonContainer}>
            <Image source={require('../pics/download5.png')} style={styles.icon} />
            <CustomButton title="Upload Timetable" onPress={handleUploadTimetable} />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttonContainer}>
            <Image source={require('../pics/download6.png')} style={styles.icon} />
            <CustomButton title="Upload Syllabus" onPress={handleUploadSyllabus} />
          </View>
          <View style={styles.buttonContainer}>
            <Image source={require('../pics/download7.png')} style={styles.icon} />
            <CustomButton title="Results" onPress={handleDownloadReports} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.circle2}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#28C2A0',
    top: -110,
    left: -50,
  },
  // circle2: {
  //   position: 'absolute',
  //   width: 200,
  //   height: 200,
  //   borderRadius: 100,
  //   backgroundColor: '#0C46C4',
  //   bottom: 0,
  //   right: -50,
  // },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 100, // Ensure padding to avoid overlap with the circle
  },
  title: {
    fontSize: 28,
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
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
});

export default AdminDashboard;
