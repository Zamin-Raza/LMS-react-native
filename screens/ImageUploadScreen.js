import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore, { FieldPath } from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';

const ImageUploadScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [className, setClassName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const uploadImage = async () => {
    if (imageUri && className) {
      const filename = className + '/' + new Date().getTime().toString();
      const reference = storage().ref(filename);
      const task = reference.putFile(imageUri);

      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });

      task.then(async () => {
        const url = await reference.getDownloadURL();
        console.log(typeof(className));
        firestore().collection('Timetable').doc(className).set({
          imageUrl: url,
        });
        console.log('Image uploaded to the bucket!');
      }).catch((e) => console.log('uploading image error => ', e));
    } else {
      console.log('Please select an image and enter a class name');
    }
  };

  const viewImage = async () => {
    if (className) {
      console.log(className)
      const doc = await firestore().collection('Timetable').doc(className).get();
     
      if (doc.exists) {
        setDownloadUrl(doc.data().imageUrl);
      } else {
        console.log('No such document!');
      }
    } else {
      console.log('Please enter a class name');
    }
  };
  const deleteimg = async () => {

    
    if (className) {
      console.log("ye chala");
      try {
        // Fetch the document to get the image URL
        const doc = await firestore().collection('Timetable').doc(className).get();
        if (doc.exists) {
          console.log("ye chala 2");
          const imageUrl = doc.data().imageUrl;
  
          // Delete the document from Firestore
          await firestore().collection('Timetable').doc(className).delete();
  
          // Get the storage reference from the image URL
          const storageRef = storage().refFromURL(imageUrl);
  
          // Delete the image from Firebase Storage
          await storageRef.delete();
  
          // Clear the state
          setDownloadUrl(null);
          setImageUri(null);
          setClassName('');
  
          
        } else {
          console.log('No such document!');
        }
      } catch (e) {
        console.log('Error deleting image:', e);
      }
    } else {
      console.log('Please enter a class name');
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.circle1}></View>
          <View style={styles.circle2}></View>
          <View style={styles.header}>
            <Text style={styles.headerText}>Upload Timetable</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Class Name"
            value={className}
            onChangeText={setClassName}
            placeholderTextColor="#0C46C4"
          />
          <TouchableOpacity style={[styles.button, styles.buttonSelect]} onPress={selectImage}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonUpload]} onPress={uploadImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonView]} onPress={viewImage}>
            <Text style={styles.buttonText}>View Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonView]} onPress={deleteimg}>
            <Text style={styles.buttonText}>Delete Image</Text>
          </TouchableOpacity>
          {downloadUrl && <Image source={{ uri: downloadUrl }} style={styles.image} />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    marginTop: 100, // Adjust this value based on the size of the top shape
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0C46C4',
    textShadowColor: '#28C2A0',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
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
  input: {
    height: 40,
    borderColor: '#28C2A0',
    borderWidth: 3,
    borderRadius: 10, // Updated border radius
    marginBottom: 20,
    padding: 8,
    width: '85%',
    color: '#0C46C4',
    backgroundColor: '#f0f0f0',
  },  
  button: {
    width: '60%',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSelect: {
    backgroundColor: '#28C2A0',
  },
  buttonUpload: {
    backgroundColor: '#0C46C4',
  },
  buttonView: {
    backgroundColor: '#28C2A0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default ImageUploadScreen;
