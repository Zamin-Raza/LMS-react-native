import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Loginacc = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const login_check = async () => {
    try {
      

        // await auth().signInWithEmailAndPassword(email, password);
        // console.log("Sign in successful");
        navigation.navigate('AdminDashboard', { email });
       
        throw new Error('Invalid email or password');
      
    } catch (e) {
      setError("Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.formContainer}>
        <Text style={styles.label}>Enter Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#000000"
        />
        <Text style={styles.label}>Enter Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#000000"
          secureTextEntry
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={login_check}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#F7F7F7',
    color: '#000000',
    width: '100%',
    height: 45,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
    textShadowColor: '#CCCCCC',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  circle1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#28C2A0',
    position: 'absolute',
    top: -50,
    left: -50,
  },
  circle2: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0C46C4',
    position: 'absolute',
    bottom: -100,
    right: -100,
  },
  button: {
    backgroundColor: '#28C2A0',
    padding: 15,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    height: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Loginacc;
