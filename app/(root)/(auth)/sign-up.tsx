import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from "expo-router";
import AwesomeAlert from 'react-native-awesome-alerts';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidDate = (date: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
  };

  const handleSignUp = async () => {
    console.log("📝 Starting SignUp process...");

    // Vérification email
    if (!isValidEmail(email.trim())) {
      console.log("❌ Invalid email format.");
      setAlertMessage("Invalid email format. Please use a correct email.");
      setAlertVisible(true);
      return;
    }

    // Vérification date de naissance
    if (!isValidDate(dateOfBirth.trim())) {
      console.log("❌ Invalid date format.");
      setAlertMessage("Invalid date format. Use YYYY-MM-DD.");
      setAlertVisible(true);
      return;
    }

    // Vérification mots de passe
    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match.");
      setAlertMessage("Passwords do not match!");
      setAlertVisible(true);
      return;
    }

    // Construction du JSON
    const requestBody = {
      email: email.trim(),
      password_hash: password.trim(),
      date_of_birth: dateOfBirth.trim()
    };

    console.log("📤 Sending request to API:", JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch('http://10.19.4.2:8001/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      console.log("📄 Raw API Response:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (error) {
        console.log("⚠️ Failed to parse API response:", error);
        throw new Error("Invalid API response.");
      }

      if (response.ok) {
        console.log("✅ User created successfully:", responseData);
        router.push('/sign-in');
      } else {
        console.log("❌ API returned an error:", responseData);
        setAlertMessage(responseData.message || "User creation failed.");
        setAlertVisible(true);
      }
    } catch (error) {
      console.log("🚨 Request failed:", error);
      setAlertMessage(error.message || "An unexpected error occurred.");
      setAlertVisible(true);
    }
  };

  return (
    <SafeAreaView className='h-full bg-primary-300 flex items-center'>
      <Text className='font-bold font-rubik text-secondary mt-10 text-4xl text-center'>Create Account</Text>
      <Text className='font-bold font-rubik text-white mt-10 text-3xl text-center'>Let's Start!</Text>
      
      <View className='w-full bg-terciary mt-8'>
        <View className='mx-20'>
          <Text className='font-rubik pl-2 pt-5 pb-1'>Email</Text>
          <TextInput 
            className='w-80 bg-white rounded-2xl pl-4' 
            placeholder="email@example.com" 
            placeholderTextColor="#232323" 
            value={email} 
            onChangeText={setEmail} 
          />

          <Text className='font-rubik pt-5 pb-1 pl-2'>Date of Birth</Text>
          <TextInput 
            className='w-80 bg-white rounded-2xl pl-4' 
            placeholder="YYYY-MM-DD" 
            placeholderTextColor="#232323" 
            value={dateOfBirth} 
            onChangeText={setDateOfBirth} 
          />

          <Text className='font-rubik pt-5 pb-1 pl-2'>Password</Text>
          <TextInput 
            className='w-80 bg-white rounded-2xl pl-4' 
            placeholder="***************" 
            placeholderTextColor="#232323" 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
          />

          <Text className='font-rubik pt-5 pb-1 pl-2'>Confirm Password</Text>
          <TextInput 
            className='w-80 bg-white rounded-2xl pl-4 mb-8' 
            placeholder="***************" 
            placeholderTextColor="#232323" 
            secureTextEntry 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
          />
        </View>
      </View>

      <Text className='text-center text-white font-rubik-light mt-3'>
        By continuing, you agree to{"\n"}
        <View className='flex-row justify-center items-center'>
          <TouchableOpacity>
            <Link href={'/(legal)/cgu'} className='text-sm text-secondary font-rubik'>
              Term of Use
            </Link>
          </TouchableOpacity>
          <Text className='text-sm text-white mx-1'> and </Text>
          <TouchableOpacity>
            <Link href={'/(legal)/privacy'} className='text-sm text-secondary font-rubik'>
              Privacy Policy
            </Link>
          </TouchableOpacity>
          <Text className='text-sm text-white'>.</Text>
        </View>
      </Text>

      <View>
        <TouchableOpacity onPress={handleSignUp}>
          <Text className='text-white font-rubik-bold text-2xl mt-16 py-3 px-20 bg-primary-100 rounded-full border-solid border-primary-200 border-2'>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      <View className='absolute bottom-0 w-full flex items-center mb-8 px-12'>
        <View className='flex-row items-center'>
          <Text className='text-white'>Already have an account? </Text>
          <TouchableOpacity>
            <Link href='/sign-in' className='text-secondary'>Sign In</Link>
          </TouchableOpacity>
        </View>
      </View>

      {/* Alert */}
      <AwesomeAlert
        show={alertVisible}
        showProgress={false}
        title="Error"
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SignUp;
