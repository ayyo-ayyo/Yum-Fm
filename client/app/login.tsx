import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Modal, Image, Animated, Keyboard, Platform} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginHelp } from '@/constants/Help';
import HelpButton from '@/components/HelpButton';
import HelpModal from '@/components/HelpModal';
import { hashPassword } from './password_hasher';
import * as SessionInfo from './session_info';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);

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

  SessionInfo.logout();

  const handleLogin = async () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      setModalVisible(true);
      return;
    }

    setLoading(true);

    setLoading(false);
    if (regex.test(email) && password !== '') {
      // Need to validate if the email and password were correct
      hashPassword(password).then(async (hash) => {
        console.log(hash);
        const res = await fetch('https://yum-fm-90558e78d331.herokuapp.com/api/login', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: email, password: hash})
        });

        if (res.status != 200) {
          const errorText = await res.text();
          setErrorMessage(errorText);
          setModalVisible(true);
          return;
        }
        
        const resJSON = await res.json();
        SessionInfo.login(resJSON._id, resJSON.token);
        router.replace('/(tabs)');
      });
    } else {
      setErrorMessage('Invalid email or password.');
      setModalVisible(true);
    }
  };

  const handleCreateAccount = () => {
    router.push('/create-account');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Animated container for inputs */}
      <Animated.View style={[styles.inputContainer, { transform: [{ translateY: moveAnim }] }]}>
        {/* Logo */}
        <Image
          source={require('../assets/images/Yum.FM_LOGO.png')}
          style={styles.logo}
        />
        
        {/* Email and Password Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
          {/* Buttons Container */}
        <View style={styles.buttonContainer}>
          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
            <Text style={styles.buttonTextCreateAccount}>Don't have an account? Click here to sign up!</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Help text modal */}
      <HelpModal 
        showModal={setHelpVisible} 
        text={loginHelp}
        visible={helpVisible}
      />
      <HelpButton showModal={setHelpVisible}/>


      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    // This allows the inputs to be animated
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3E2CF',
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginLeft: 27,
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: 'column', // Arrange buttons vertically
    marginTop: 15,
  },
  loginButton: {
    backgroundColor: '#D74938',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10, // Add margin for spacing
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  helpButton: {
    paddingHorizontal: 0, 
    paddingVertical: 0, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 50, height: 50, 
    borderRadius: 35,
    position: "absolute",
    bottom: 50,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  createAccountButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextCreateAccount: {
    color: '#D74938', // Make the text red
    fontSize: 16,
    fontWeight: '600',
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