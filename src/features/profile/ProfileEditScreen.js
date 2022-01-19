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
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import axiosInstance from '../../services/Axios';
import {ADDRESS_URL, PROFILE_URL} from '../../utils/urls';
import {format, parse, isEqual} from 'date-fns';
import {Formik, validateYupSchema} from 'formik';
import * as Yup from 'yup';

import DatePickerForm from './DatePickerForm';
import StatePickerForm from './StatePickerForm';
import DistrictPickerForm from './DistrictPickerForm';
import PinPickerForm from './PinPickerForm';
import VillOrTownPickerForm from './VillOrTownPickerForm';

import VillOrTownView from './components/VillOrTownView';
import PinView from './components/PinView';
import DistrictView from './components/DistrictView';
import StateView from './components/StateView';

// ===================================================
// Edit profile Schema
// ===================================================
const phoneRegExp =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

const UpdateProfileSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('Please enter your first name')
    .max(30, 'Maximum 30 Characters long'),
  middle_name: Yup.string(),
  last_name: Yup.string()
    .required('Please enter your last name')
    .max(30, 'Maximum 30 characters long'),
  phone_number: Yup.string()
    .required('Enter your valid phone number ')
    .matches(phoneRegExp, 'Phone number is not valid'),
  house_no: Yup.string().required('Please enter your house no or C/O'),
  landmark: Yup.string().required(
    'Please enter a landmark (Road/ building/ office etc',
  ),
});

const ProfileEditScreen = ({route, Navigation}) => {
  const {profile} = route.params;
  return (
    <Formik
      initialValues={{
        first_name: profile.first_name,
        middle_name: profile.middle_name,
        last_name: profile.last_name,
        house_no: profile.house_no,
        landmark: profile.landmark,
        phone_number: profile.phone_number,
        birthday:
          profile.birthday && format(new Date(profile.birthday), 'dd-MM-yyyy'),
        village_or_town: '',
        pin: '',
        district: '',
        state: '',
      }}
      validationSchema={UpdateProfileSchema}
      onSubmit={(values, {setSubmitting, resetForm}) => {
        // Prepare updated data
        let data = {
          first_name: values.first_name,
          middle_name: values.middle_name,
          last_name: values.last_name,
        };

        // Add birthday if changed
        // =============================
        if (values.birthday) {
          const oldDate = parse(profile.birthday, 'yyyy-MM-dd', new Date());
          const newDate = parse(values.birthday, 'dd-MM-yyyy', new Date());
          if (!isEqual(oldDate, newDate)) {
            data = {
              ...data,
              birthday: format(newDate, 'yyyy-MM-dd'),
            };
          }
        }

        // Add phone_number if changed
        // ==============================
        if (
          values.phone_number &&
          values.phone_number !== profile.phone_number
        ) {
          data = {
            ...data,
            phone_number: values.phone_number,
            is_phone_verified: false,
          };
        }

        // Add State, District, PIN, & Vill/Town
        // if vill/Town changed
        // ====================================
        if (
          values.village_or_town &&
          values.village_or_town.url !== profile.village_or_town
        ) {
          data = {
            ...data,
            state: values.state.url,
            district: values.district.url,
            pin: values.pin.url,
            village_or_town: values.village_or_town.url,
          };
        }

        // Store update to server
        axiosInstance
          .patch(profile.url, data)
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.log(err);
          });
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        values,
        setFieldValue,
        errors,
        touched,
        resetForm,
      }) => (
        <View style={styles.container}>
          <ScrollView style={styles.scroller}>
            <Text>Edit Profile</Text>

            <View style={styles.inputGroup}>
              <Text>First name: </Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                onChangeText={handleChange('first_name')}
                onBlur={handleBlur('first_name')}
                value={values.first_name}
              />
              {errors.first_name && (
                <Text style={styles.errorText}>{errors.first_name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text>Middle name: </Text>
              <TextInput
                style={styles.input}
                placeholder="Middle name"
                onChangeText={handleChange('middle_name')}
                onBlur={handleBlur('middle_name')}
                value={values.middle_name}
              />
              {errors.middle_name && (
                <Text style={styles.errorText}>{errors.middle_name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text>Last name: </Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                onChangeText={handleChange('last_name')}
                onBlur={handleBlur('last_name')}
                value={values.last_name}
              />
              {errors.last_name && (
                <Text style={styles.errorText}>{errors.last_name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text>Birthday: </Text>
              <DatePickerForm values={values} setFieldValue={setFieldValue} />
            </View>

            <View style={styles.inputGroup}>
              <Text>Phone number:</Text>
              <TextInput
                style={styles.input}
                placeholder="Your valid mobile number"
                onChangeText={handleChange('phone_number')}
                onBlur={handleBlur('phone_number')}
                value={values.phone_number}
              />
              {errors.phone_number && (
                <Text style={styles.errorText}>{errors.phone_number}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text>Select State</Text>
              <StatePickerForm values={values} setFieldValue={setFieldValue} />
            </View>
            <View style={styles.inputGroup}>
              <Text>Select District</Text>
              <DistrictPickerForm
                values={values}
                setFieldValue={setFieldValue}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text>Select PIN</Text>
              <PinPickerForm values={values} setFieldValue={setFieldValue} />
            </View>
            <View style={styles.inputGroup}>
              <Text>Select Village/Town</Text>
              <VillOrTownPickerForm
                values={values}
                setFieldValue={setFieldValue}
              />
            </View>
            <View style={{width: '100%', height: 40}}></View>
          </ScrollView>
          <View style={styles.bottomFormControl}>
            <TouchableOpacity onPress={resetForm} style={styles.resetButton}>
              <Text style={{color: '#fff', textTransform: 'uppercase'}}>
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}>
              <Text style={{color: '#fff', textTransform: 'uppercase'}}>
                Update Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroller: {
    width: '100%',
    padding: 10,
  },
  inputGroup: {
    margin: 10,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  errorText: {
    color: 'red',
  },
  bottomFormControl: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resetButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#888888',
    alignItems: 'center',
    marginRight: 5,
  },
  submitButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#559999',
    alignItems: 'center',
    marginLeft: 5,
  },
});

export default ProfileEditScreen;
