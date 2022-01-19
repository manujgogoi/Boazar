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
} from 'react-native';
import {useDispatch} from 'react-redux';
import {userLoginAsync} from './authSlice';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../services/Axios';
import {storeTokens} from '../../services/encryptedStorage';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required(),
  password: Yup.string().required(),
});

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState('');

  // Server error formatting Element
  // =====================================
  const ErrorElement = () => {
    if (serverError) {
      // return Object.keys(serverError).map((keyName, i) => (
      //   <Text key={i}>
      //     {keyName} :{' '}
      //     {typeof keyName === 'string'
      //       ? serverError[keyName]
      //       : serverError[keyName][i]}
      //   </Text>
      // ));
      return <Text>{serverError}</Text>;
    }
    return <Text></Text>;
  };

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validationSchema={SignInSchema}
      onSubmit={(values, {setSubmitting}) => {
        dispatch(userLoginAsync(values))
          .unwrap()
          .then(res => {
            storeTokens(res.access, res.refresh)
              .then(() => {
                axiosInstance.defaults.headers['Authorization'] =
                  'Bearer ' + res.access;
              })
              .catch(err => {
                console.log('storeTokens error: ', err);
                setSubmitting(false);
              });
          })
          .catch(err => {
            if (err.status === undefined) {
              setServerError('Server not reachable');
            } else if (err.status === 401) {
              setServerError(err.data['detail']);
            } else {
              setServerError('Some error occured try again...');
            }
            console.log(err);
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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ErrorElement />
          <Text style={{fontSize: 20}}>Login Screen</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter registered email Id"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          {errors.email && touched.email ? <Text>{errors.email}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Enter valid password"
            secureTextEntry={true}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          {errors.password && touched.password ? (
            <Text>{errors.password}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            <Text style={styles.buttonLabel}>
              {isSubmitting ? <ActivityIndicator color="#fff" /> : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
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

  loginButton: {
    backgroundColor: '#1e90ff',
    padding: 8,
    elevation: 5,
    margin: 5,
    borderRadius: 2,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {color: '#fff', textTransform: 'uppercase'},
});

export default LoginScreen;
