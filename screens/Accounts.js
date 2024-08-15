import React, { useState , useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Accounts = () => {
  
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [Class, setClass] = useState('');
  const [ID, setmyid] = useState(0);
  const [Name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchID();
  }, []);

  const fetchID = async () => {
    console.log("ye chala");
    try {
      const snapshot = await firestore().collection('Teacher').orderBy("TeachID",'desc').limit(1).get();

      if (!snapshot.empty) {
        console.log("aik pehly se hai");
        let lastId = snapshot.docs[0].data().TeachID;

        console.log(lastId+1);
        var val = lastId+1;
        console.log(val + " dsadsad");

       
        
        setmyid(val);
        console.log(ID);
        console.log(typeof(ID));
        setEmail("teacher"+ID+"@school.com");
        console.log('teacher'+ID+'@school.com')
        setPassword("Teacher"+ID+"XYZ");
      
      }
      else{

        console.log("ye nahi hy");

        
        setId(0);
        setEmail("Teacher"+ID+"@school.com");
        setPassword("Teacher"+ID+"XYZ");
      }
    }
    catch(e){
      console.log(e);
    }
  }


  const check = ()=>{
    console.log(ID)
    console.log(email)
    console.log(password); 
    console.log(Name);
    console.log(Class);
  }
 

  const handleSignin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log("Sign in successful ");
      navigation.navigate('Crud');
    } catch (e) {
      setError("Invalid email or password");
    }
  };

  const handleLogin = async () => {
    try {
      if(Class){
      if (email && password) {
        console.log(email);
        console.log(ID);
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        console.log('User signed up successfully!', userCredential.user);

        try {

        await firestore().collection('Teacher').doc(ID.toString()).set({
          TeachID : ID,
          TecherName : Name,
          TeacherEmail : email,
      
          TeacherClass : Class

        })
        console.log("added succefully")
        setName('');
        setClass('');
        fetchID();
        }
        catch(e){
          console.log(e);
        }
      
        // Optionally, you can navigate to another screen or perform additional actions after successful signup.
      }
    }
    else{
      Alert.alert("Mention a Class");
    }
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle1}></View>
      <View style={styles.circle2}></View>
      <Text style={styles.headerText}>Accounts</Text>
      <Text style={styles.label}>Enter Email:</Text>

      <TextInput
        style={styles.input}
        value={email}
        // editable = {false}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor="black"
      />
      <Text style={styles.label}>Enter Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        // editable = {false}
        onChangeText={setPassword}
      
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        value={Class}
        onChangeText={setClass}
        placeholder="Enter class "
        placeholderTextColor="black"
      />

      <TextInput
        style={styles.input}
        value={Name}
        onChangeText={setName}
        placeholder="Enter Name of Teacher "
        placeholderTextColor="black"
      />

      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
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
    right: -50,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0C46C4',
    marginBottom: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginRight: 200,
    color: '#333333',
  },
  input: {
    width: "95%",
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#F7F7F7',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#28C2A0',
    padding: 15,
    borderRadius: 50,
    width: '50%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Accounts;
