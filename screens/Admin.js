import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ScrollView,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const Admin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (username === 'example' && password === 'password') {
        Alert.alert('Login Successful', 'You are now logged in.');
        // Perform navigation to the next screen or any success action
      } else {
        Alert.alert('Login Failed', 'Invalid username or password.');
      }
    }, 1500);
    navigation.navigate('Crud');
  };

  const handleNavigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };
  const handleNavigateToSetupAccount = () => {
    navigation.navigate('SetupAccount');
  };

  const isSubmitDisabled = !username || !password || isLoading;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>

      <View style={styles.hometop}>
      <Image
          source={require("./admin2.png")}
          style={styles.imagehead}
          resizeMode="cover"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text1}>
          Admin Login
        </Text>
      </View>

      <View style={styles.textFieldcontainer}>
        <TextInput
          style={styles.input}
          placeholder="Email or Phone Number"
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholderTextColor='#777'
        />
      </View>

      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Password"
        secureTextEntry={!showPassword}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholderTextColor='#777'
      />
      <TouchableOpacity
        style={styles.showPasswordToggle}
        onPress={() => setShowPassword((prevShow) => !prevShow)}
      >
        <Icon
          name={showPassword ? 'eye-slash' : 'eye'}
          size={20}
          color="#7777"
        />
      </TouchableOpacity>
    </View>

      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity style={styles.forgotPasswordLink}>
        <Text style={styles.forgotPasswordText} onPress={handleNavigateToForgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isSubmitDisabled && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isSubmitDisabled}
        >
          {isLoading ? (
            <Text style={styles.buttonText}>Logging in...</Text>
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  hometop: {
    display: 'flex',
    overflow: 'hidden',
  },
  imagehead: {
    marginTop: '15%',
    width: '100%',
    height: '60%',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: -260,
    color: "black",
  },
  textFieldcontainer: {
    padding: 20,
    marginTop: -110,
    color: "black",
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 2,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: "black",
    borderRadius: 15,
    height: 50, // Increase the height
  },
  passwordContainer: {
    padding: 20,
    flexDirection: 'row', // Add flexDirection to align the password input and show/hide button horizontally
    alignItems: 'center', // Center items vertically in the row
    marginTop: -30,
  },
  passwordInput: {
    flex: 1, // Take up remaining space in the row
    height: 50, // Increase the height
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    borderRadius: 15,
  },
  showPasswordToggle: {
    paddingHorizontal: 10,
    marginLeft: -40, // Adjust the margin to align the eye icon with the password input
    marginTop: -10,
  },
  showPasswordText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  forgotPasswordLink: {
    alignItems: 'flex-end',
    marginRight: 20,
    marginTop: -10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontWeight: 'bold',
    marginTop: -10,
    fontSize: 13,
    color:"#989898",
  },


  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
    backgroundColor: 'green',
    width: '90%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginTop: -20,
    marginLeft: 20,
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },


});

export default Admin;
