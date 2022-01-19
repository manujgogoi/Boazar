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
import {format} from 'date-fns';
import {Formik} from 'formik';
import * as Yup from 'yup';

import DatePickerForm from './DatePickerForm';
import StatePickerForm from './StatePickerForm';
import DistrictPickerForm from './DistrictPickerForm';
import PinPickerForm from './PinPickerForm';
import VillOrTownPickerForm from './VillOrTownPickerForm';

// ===================================================
// Add profile Schema
// ===================================================
const phoneRegExp =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

const AddProfileSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('Please enter your first name')
    .max(30, 'Maximum 30 Characters long'),
  middle_name: Yup.string(),
  last_name: Yup.string()
    .required('Please enter your last name')
    .max(30, 'Maximum 30 characters long'),
  phone_number: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  house_no: Yup.string().required('Please enter your house no or C/O'),
  landmark: Yup.string().required(
    'Please enter a landmark (Road/ building/ office etc',
  ),
  state: Yup.object().shape({
    name: Yup.string().required('Please select your state'),
    id: Yup.number().required('Invalid State'),
  }),
  district: Yup.object().shape({
    name: Yup.string().required('Please select your district'),
    id: Yup.number().required('Invalid District'),
  }),
  pin: Yup.object().shape({
    code: Yup.string().required('Please select your PIN code'),
    id: Yup.number().required('Invalid PIN'),
  }),
  village_or_town: Yup.object().shape({
    name: Yup.string().required('Please select your village or town'),
    id: Yup.number().required('Invalid Village or Town'),
  }),
});

const ProfileAddScreen = () => {
  return (
    <Formik
      initialValues={{
        first_name: '',
        middle_name: '',
        last_name: '',
        birthday: '',
        phone_number: '',
        state: '',
        district: '',
        pin: '',
        village_or_town: '',
        house_no: '',
        landmark: '',
      }}
      validationSchema={AddProfileSchema}
      onSubmit={(values, {setSubmitting, resetForm}) => {
        // prepare data to save
        let data = {
          first_name: values.first_name,
          middle_name: values.middle_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          house_no: values.house_no,
          landmark: values.landmark,
          state: values.state.url,
          district: values.district.url,
          pin_code: values.pin.url,
          village_or_town: values.village_or_town.url,
        };

        if (values.birthday) {
          data = {
            ...data,
            birthday: format(new Date(values.birthday), 'yyyy-MM-dd'),
          };
        }

        // Add profile to database
        // ==============================================
        axiosInstance
          .post(`${PROFILE_URL}`, data)
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
      }) => (
        <View style={{flex: 1}}>
          <ScrollView>
            <Text>Add Profile</Text>

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
            <Text>Birthday:</Text>
            <DatePickerForm values={values} setFieldValue={setFieldValue} />
            {errors.birthday && (
              <Text style={styles.errorText}>{errors.birthday}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="A Valid Phone Number"
              onChangeText={handleChange('phone_number')}
              onBlur={handleBlur('phone_number')}
              value={values.phone_number}
            />
            {errors.phone_number && (
              <Text style={styles.errorText}>{errors.phone_number}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="House No"
              onChangeText={handleChange('house_no')}
              onBlur={handleBlur('house_no')}
              value={values.house_no}
            />
            {errors.house_no && (
              <Text style={styles.errorText}>{errors.house_no}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Landmark"
              onChangeText={handleChange('landmark')}
              onBlur={handleBlur('landmark')}
              value={values.landmark}
            />
            {errors.landmark && (
              <Text style={styles.errorText}>{errors.landmark}</Text>
            )}

            <Text>Select State</Text>
            <StatePickerForm values={values} setFieldValue={setFieldValue} />
            {errors.state?.name && (
              <Text style={styles.errorText}>{errors.state.name}</Text>
            )}

            <Text>Select District</Text>
            <DistrictPickerForm values={values} setFieldValue={setFieldValue} />
            {errors.district?.name && (
              <Text style={styles.errorText}>{errors.district.name}</Text>
            )}

            <Text>Select PIN Code</Text>
            <PinPickerForm values={values} setFieldValue={setFieldValue} />
            {errors.pin?.code && (
              <Text style={styles.errorText}>{errors.pin.code}</Text>
            )}

            <Text>Select Village or Town</Text>
            <VillOrTownPickerForm
              values={values}
              setFieldValue={setFieldValue}
            />
            {errors.village_or_town?.name && (
              <Text style={styles.errorText}>
                {errors.village_or_town.name}
              </Text>
            )}
          </ScrollView>
          <View style={styles.bottomMenu}>
            <TouchableOpacity
              onPress={handleSubmit}
              // disabled={isSubmitting}
              style={styles.bottomMenuButton}>
              <Text>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomMenuButton}>
              <Text>Back</Text>
            </TouchableOpacity>
          </View>
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
  bottomMenu: {
    backgroundColor: 'tomato',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 50,
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
    marginBottom: 10,
  },
  bottomMenuButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default ProfileAddScreen;
