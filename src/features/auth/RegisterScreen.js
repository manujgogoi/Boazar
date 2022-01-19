/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Touchable,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../services/Axios';
import axios from 'axios';
import {BASE_URL, USER_URL} from '../../utils/urls';

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid Email')
    .required('Please enter your valid email id')
    .test(
      'Unique Email',
      'Email already in use',
      value =>
        new Promise((resolve, reject) => {
          axios
            .post(`${BASE_URL}users/email_exists/`, {email: value})
            .then(res => {
              if (res.data) {
                resolve(false);
              }
              resolve(true);
            });
        }),
    ),
  password: Yup.string().required('Please enter a password'),
  confirmPassword: Yup.string()
    .required('Please re-type your password')
    .oneOf([Yup.ref('password'), null], 'Password mismatch'),
});

const RegisterScreen = () => {
  const [serverError, setServerError] = useState('');
  const [created, setCreated] = useState('');

  // Server error formatting Element
  // =====================================
  const ErrorElement = () => {
    if (serverError) {
      return Object.keys(serverError).map((keyName, i) => (
        <Text key={i}>
          {keyName} :{' '}
          {typeof keyName === 'string'
            ? serverError[keyName]
            : serverError[keyName][i]}
        </Text>
      ));
    }
    return <Text></Text>;
  };

  // Success Element
  // ======================================
  const SuccessElement = () => {
    if (created) {
      return <Text>{created}</Text>;
    }
    return <></>;
  };

  return (
    <Formik
      initialValues={{email: '', password: '', confirmPassword: ''}}
      validationSchema={RegisterSchema}
      onSubmit={(values, {setSubmitting, resetForm}) => {
        console.log(values);
        // Create user custom axios call
        axios
          .post(USER_URL, {
            email: values.email,
            password: values.password,
          })
          .then(res => {
            setCreated('Registered successfully. Go to Login');
            setSubmitting(false);
            resetForm();
            Keyboard.dismiss();
          })
          .catch(err => {
            console.log('Register Screen : ', err);
            // setServerError(err);
            setSubmitting(false);
          });
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        values,
        errors,
        touched,
      }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ErrorElement />
            <SuccessElement />
            <Text style={{fontSize: 20}}>Register Screen</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your valid email Id"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && touched.email ? <Text>{errors.email}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Enter a password"
              secureTextEntry={true}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {errors.password && touched.password ? (
              <Text>{errors.password}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry={true}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <Text>{errors.confirmPassword}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSubmit}
              disabled={isSubmitting}>
              <Text style={styles.buttonLabel}>
                {isSubmitting ? <ActivityIndicator color="#fff" /> : 'Register'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  registerButton: {
    backgroundColor: '#1e90ff',
    padding: 8,
    elevation: 5,
    margin: 5,
    borderRadius: 2,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {color: '#fff', textTransform: 'uppercase'},
});

export default RegisterScreen;
