import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const Addfee = ({ navigation }) => {
  const [registrations, setRegistrations] = useState([]);
  const [formData, setFormData] = useState({
    selectedRegistration: '',
    studentName: '',
    amountDue: '',
    amountPaid: '',
    payableAmount: '',
    paymentDate: new Date(),
    remarks: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchName = async(name, value) => {
    console.log('Fetching student name...');
    try {
      const stdname = await firestore().collection('Student').where("registrationNumber", "==", value).get();
      if(!stdname.empty) {
        const Nameofstd = stdname.docs[0].data().Name;
        console.log(Nameofstd);
        setFormData((prevState) => ({ ...prevState, [name]: value, studentName: Nameofstd }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const snapshot = await firestore().collection('Student').get();
      const registrationList = snapshot.docs.map((doc) => ({
        label: doc.data().registrationNumber,
        value: doc.id,
      }));
      setRegistrations(registrationList);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const Add_feerec = async () => {
    console.log("Adding fee record...");
    try {
      await firestore().collection("Fees")
        .doc(formData.selectedRegistration)
        .set({
          RegNo: formData.selectedRegistration,
          amount_due: formData.amountDue,
          amount_paid: formData.amountPaid,
          payableAmount: formData.payableAmount,
          paymentDate: formData.paymentDate.toISOString(),
          remarks: formData.remarks,
        });
      Alert.alert("Fee added successfully");
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (name, value) => {
    if (name === 'selectedRegistration') {
      fetchName(name, value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.paymentDate;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({ ...formData, paymentDate: currentDate });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    navigation.goBack();
  };

  const { height } = Dimensions.get('window');
  const gradientHeight = height * 0.4;

  return (
    <View style={[styles.container, { height: gradientHeight }]}>
      <View style={styles.gradient} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>ADD FEE</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Select Registration:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.selectedRegistration}
              onValueChange={(itemValue) => handleChange('selectedRegistration', itemValue)}>
              {registrations.map((registration) => (
                <Picker.Item key={registration.value} label={registration.label} value={registration.label} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label3D}>Student Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.studentName}
            editable={false}
            onChangeText={(text) => handleChange('studentName', text)}
            placeholder="Enter student name"
            placeholderTextColor="#000000" // Black color for placeholder text
          />
          <Text style={styles.label3D}>Amount Due:</Text>
          <TextInput
            style={styles.input}
            value={formData.amountDue}
            onChangeText={(text) => handleChange('amountDue', text)}
            keyboardType="numeric"
            placeholder="Enter amount due"
            placeholderTextColor="#000000" // Black color for placeholder text
          />
          <Text style={styles.label3D}>Amount Paid:</Text>
          <TextInput
            style={styles.input}
            value={formData.amountPaid}
            onChangeText={(text) => handleChange('amountPaid', text)}
            keyboardType="numeric"
            placeholder="Enter amount paid"
            placeholderTextColor="#000000" // Black color for placeholder text
          />
          <Text style={styles.label3D}>Payable Amount:</Text>
          <TextInput
            style={styles.input}
            value={formData.payableAmount}
            onChangeText={(text) => handleChange('payableAmount', text)}
            keyboardType="numeric"
            placeholder="Enter payable amount"
            placeholderTextColor="#000000" // Black color for placeholder text
          />
          <Text style={styles.label3D}>Payment Date:</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              value={formData.paymentDate.toLocaleDateString()}
              editable={false}
              placeholder="Enter payment date"
              placeholderTextColor="#000000" // Black color for placeholder text
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.paymentDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Text style={styles.label3D}>Remarks:</Text>
          <TextInput
            style={styles.input}
            value={formData.remarks}
            onChangeText={(text) => handleChange('remarks', text)}
            placeholder="Enter remarks"
            placeholderTextColor="#000000" // Black color for placeholder text
          />
          <TouchableOpacity style={styles.addButton} onPress={Add_feerec}>
            <Text style={styles.buttonText}>Add Fee Status</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#28C2A0',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF', // White color
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 3, // Add elevation for shadow effect
    marginHorizontal: 20, // Add some margin horizontally
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333', // Darker text color
  },
  label3D: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333', // Darker text color
    textShadowColor: '#CCCCCC', // Lighter shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 2, // Shadow radius
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC', // Lighter border color
    borderRadius: 15,
    marginBottom: 15,
    height: 48,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC', // Lighter border color
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#F7F7F7', // Lighter background color
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3, // Lighter shadow opacity
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#28C2A0',
    padding: 15,
    borderRadius: 50,
    width: '50%',
    alignSelf: 'center', // Align button to the center horizontally
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center', // Center text horizontally
  },
});

export default Addfee;
