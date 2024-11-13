import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Router, useRouter } from 'expo-router';

export default function CreateAccountScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateAccount = () => {
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
    setTimeout(() => {
      setTimeout(() => {
        setModalVisible(false);
        router.replace('/login');
      }, 2000); // Wait for 2 seconds before redirecting
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
        <Text style={styles.createButtonText}>Sign Up</Text>
      </TouchableOpacity>

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
    backgroundColor: '#F4D4A3',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  createButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backToLogin: {
    color: '#e74c3c',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});