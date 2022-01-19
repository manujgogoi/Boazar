/**
 * @format
 * @flow strict-local
 */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import StatePickerForm from './StatePickerForm';
import DistrictPickerForm from './DistrictPickerForm';
import PinPickerForm from './PinPickerForm';
import VillOrTownPickerForm from './VillOrTownPickerForm';
import {TouchableOpacity} from 'react-native-gesture-handler';
import axiosInstance from '../../services/Axios';
import {DELIVERY_ADDRESS_URL} from '../../utils/urls';

// ===========================================================
// Add address schema
// ===========================================================
const AddAddressSchema = Yup.object().shape({
  house_no: Yup.string().required('Please enter house no or C/O'),
  landmark: Yup.string().required(
    'Please enter a landmark (Road/ building/ office etc',
  ),
  state: Yup.object().shape({
    name: Yup.string().required('Please select State'),
    id: Yup.number().required('Invalid State'),
  }),
  district: Yup.object().shape({
    name: Yup.string().required('Please select a district'),
    id: Yup.number().required('Invalid District'),
  }),
  pin: Yup.object().shape({
    code: Yup.string().required('Please select PIN code'),
    id: Yup.number().required('Invalid PIN'),
  }),
  village_or_town: Yup.object().shape({
    name: Yup.string().required('Please select Village or Town'),
    id: Yup.number().required('Invalid Village or Town'),
  }),
});

const AddDeliveryAddressScreen = ({route, navigation}) => {
  const {profileUrl} = route.params;
  const [isSaving, setSaving] = useState(false);
  return (
    <Formik
      initialValues={{
        state: '',
        district: '',
        pin: '',
        village_or_town: '',
        house_no: '',
        landmark: '',
      }}
      validationSchema={AddAddressSchema}
      onSubmit={(values, {setSubmitting, resetForm}) => {
        // Prepare data to save
        let data = {
          house_no: values.house_no,
          landmark: values.landmark,
          state: values.state.url,
          district: values.district.url,
          pin_code: values.pin.url,
          village_or_town: values.village_or_town.url,
          profile: profileUrl,
        };

        // Add addresses to database
        // ==================================
        axiosInstance
          .post(`${DELIVERY_ADDRESS_URL}`, data)
          .then(res => {
            // console.log(res.data);
            navigation.goBack();
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
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.inputGroup}>
              <Text>House No</Text>
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
            </View>

            <View style={styles.inputGroup}>
              <Text>Landmark</Text>
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
            </View>

            <View style={styles.inputGroup}>
              <Text>Select State</Text>
              <StatePickerForm values={values} setFieldValue={setFieldValue} />
              {errors.state?.name && (
                <Text style={styles.errorText}>{errors.state.name}</Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text>Select District</Text>
              <DistrictPickerForm
                values={values}
                setFieldValue={setFieldValue}
              />
              {errors.district?.name && (
                <Text style={styles.errorText}>{errors.district.name}</Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text>Select PIN Code</Text>
              <PinPickerForm values={values} setFieldValue={setFieldValue} />
              {errors.pin?.code && (
                <Text style={styles.errorText}>{errors.pin.code}</Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text>Select Village/ Town</Text>
              <VillOrTownPickerForm
                values={values}
                setFieldValue={setFieldValue}
              />
              {errors.village_or_town?.name && (
                <Text style={styles.errorText}>
                  {errors.village_or_town.name}
                </Text>
              )}
            </View>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                // disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? <ActivityIndicator color="#fff" /> : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: 200,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#aaa',
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
  },
});

export default AddDeliveryAddressScreen;
