import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import cap from '../pics/cap.png';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <Image source={cap} style={styles.image} />
      <Text style={styles.title}>Welcome</Text>
      <TouchableOpacity
        style={[styles.button, styles.studentButton]}
        onPress={() => navigation.navigate('Login', { userType: 'student' })}
      >
        <Text style={styles.buttonText}>Login as Student</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.teacherButton]}
        onPress={() => navigation.navigate('Login', { userType: 'teacher' })}
      >
        <Text style={styles.buttonText}>Login as Teacher</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  image: {
    width: 100, // Adjust width as needed
    height: 80, // Adjust height as needed
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: '40%', // Adjusted width to ensure the text fits well
    height: 48, // Adjusted height for better appearance
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center', // Center the text vertically
    marginVertical: 10,
  },
  studentButton: {
    backgroundColor: '#28C2A0',
  },
  teacherButton: {
    backgroundColor: '#0C46C4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  circle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#28C2A0',
    top: -50,
    left: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0C46C4',
    bottom: -50,
    right: -70,
  },
});

export default Home;