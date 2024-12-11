import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Animated, Keyboard, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { hashPassword } from './password_hasher';

export default function CreateAccountScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // Animated value for moving inputs
    const moveAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
      // Keyboard show listener
      const keyboardShowListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        (event) => {
          Animated.timing(moveAnim, {
            toValue: -100, // Adjust this value as needed
            duration: 200,
            useNativeDriver: true
          }).start();
        }
      );
  
      // Keyboard hide listener
      const keyboardHideListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => {
          Animated.timing(moveAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          }).start();
        }
      );
  
      // Clean up listeners
      return () => {
        keyboardShowListener.remove();
        keyboardHideListener.remove();
      };
    }, [moveAnim]);
  
  const handleCreateAccount = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !password) {
      setModalTitle('Error');
      setModalMessage('Please fill out all fields.');
      setModalVisible(true);
      return;
    }
    if (!emailRegex.test(email)) {
      setModalTitle('Error');
      setModalMessage('Please enter a valid email address.');
      setModalVisible(true);
      return;
    }

    const hash = await hashPassword(password);
    const res = await fetch('https://yum-fm-90558e78d331.herokuapp.com/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: email,
        email: email,
        password: hash,
        favorites_list: [],
      }),
    });

    if (res.status === 400) {
      setModalTitle('Error');
      setModalMessage(await res.text());
      setModalVisible(true);
    } else if (res.status === 201) {
      setModalTitle('Success');
      setModalMessage('Account created successfully.');
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        router.replace('/login');
      }, 2000); // Redirect after 2 seconds
    } else {
      setModalTitle('Error');
      setModalMessage('Unknown error occurred.');
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated container for content */}
      <Animated.View 
        style={[
          styles.animatedContainer, 
          { transform: [{ translateY: moveAnim }] }
        ]}
      >
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
    </Animated.View>

      {/* Error/Success Modal */}
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
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    // This allows the entire block to be animated
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3E2CF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#D74938',
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
    color: '#D74938',
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
