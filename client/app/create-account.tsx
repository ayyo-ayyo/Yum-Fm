import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { hashPassword } from './password_hasher';

export default function CreateAccountScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateAccount = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !password) {
      setErrorMessage('Please fill out all fields.');
      setModalVisible(true);
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setModalVisible(true);
      return;
    }

    // Simulate account creation logic
    setModalVisible(false);

    // Create the account after hashing the password

    const hash = await hashPassword(password);
    const res = await fetch('https://yum-fm-90558e78d331.herokuapp.com/api/signup', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user_name: email, email: email, password: hash, favorites_list: []})
    });

    if (res.status == 400) {
      Alert.alert("Error", await res.text());
    }
    else if (res.status == 201) {
      router.replace('/login');
      Alert.alert("Succes", "Account created successfully")
    }
    else {
      Alert.alert("Error", "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      {/* Page Header */}
      <Text style={styles.header}>Create Account</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Create Account Button */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.backToLogin}>Back to Login</Text>
      </TouchableOpacity>

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {errorMessage === 'Account created successfully!' ? 'Success' : 'Error'}
            </Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            {errorMessage !== 'Account created successfully!' && (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3E2CF', // Same as Login screen background
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#D74938', // Match primary color
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  createButton: {
    backgroundColor: '#D74938',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLogin: {
    color: '#D74938', // Make the text red
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D74938',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#D74938',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
