import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';


const UploadSyllabus = () => {
 
  const [imageUri, setImageUri] = useState(null);
  const [className, setClassName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);

  const classes = ['Nursery', 'Prep', '1', '2', '3', '4', '5', '6', '7', '8'];

  const fetchSubjects = async (class_id) => {
    try {
      const classDocs = await firestore().collection('Class').where('Class', '==', class_id).get();
      if (!classDocs.empty) {
        const classData = classDocs.docs[0].data();
        setSubjects(classData.Subject || []);
      } else {
        setSubjects([]);
        console.log('No subjects found for the selected class!');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

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
    if (imageUri && className && selectedSubject) {
      const filename = `${className}/${selectedSubject}/${new Date().getTime().toString()}`;
      const reference = storage().ref(filename);
      const task = reference.putFile(imageUri);

      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });

      task.then(async () => {
        const url = await reference.getDownloadURL();
        await firestore().collection('Syllabus').doc(`${className}_${selectedSubject}`).set({
          imageUrl: url,
        });
        console.log('Image uploaded to the bucket!');
      }).catch((e) => console.log('Uploading image error => ', e));
    } else {
      console.log('Please select an image, class name, and subject');
    }
  };

  const viewImage = async () => {
    if (className && selectedSubject) {
      const doc = await firestore().collection('Syllabus').doc(`${className}_${selectedSubject}`).get();
      if (doc.exists) {
        setDownloadUrl(doc.data().imageUrl);
      } else {
        console.log('No such document!');
      }
    } else {
      console.log('Please select a class name and subject');
    }
  };

  const deleteImage = async () => {
    if (className && selectedSubject) {
      try {
        const doc = await firestore().collection('Syllabus').doc(`${className}_${selectedSubject}`).get();
        if (doc.exists) {
          const imageUrl = doc.data().imageUrl;

          await firestore().collection('Syllabus').doc(`${className}_${selectedSubject}`).delete();

          const storageRef = storage().refFromURL(imageUrl);

          await storageRef.delete();

          setDownloadUrl(null);
          setImageUri(null);
          setClassName('');
          setSelectedSubject('');

          console.log('Image and document deleted successfully!');
        } else {
          console.log('No such document!');
        }
      } catch (e) {
        console.log('Error deleting image:', e);
      }
    } else {
      console.log('Please select a class name and subject');
    }
  };

  useEffect(() => {
    if (className) {
      fetchSubjects(className);
    }
  }, [className]);

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
            <Text style={styles.headerText}>Upload Syllabus</Text>
          </View>
          <Picker
            selectedValue={className}
            onValueChange={(itemValue) => setClassName(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Class" value="" />
            {classes.map((cls) => (
              <Picker.Item key={cls} label={cls} value={cls} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(itemValue) => setSelectedSubject(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Subject" value="" />
            {subjects.map((subject, index) => (
              <Picker.Item key={index} label={subject} value={subject} />
            ))}
          </Picker>
          <TouchableOpacity style={[styles.button, styles.buttonSelect]} onPress={selectImage}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonUpload]} onPress={uploadImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonView]} onPress={viewImage}>
            <Text style={styles.buttonText}>View Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonDelete]} onPress={deleteImage}>
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
  picker: {
    height: 40,
    width: '85%',
    marginBottom: 20,
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
  buttonDelete: {
    backgroundColor: '#FF0000',
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

export default UploadSyllabus;
