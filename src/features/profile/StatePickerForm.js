/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axiosInstance from '../../services/Axios';
import {ADDRESS_URL} from '../../utils/urls';

const StatePickerForm = props => {
  const {values, setFieldValue} = props;
  const [stateList, setStateList] = useState([]);
  const [stateListLoading, setStateListLoading] = useState(false);

  // Get state list on Page load
  // ======================================================
  useEffect(() => {
    let unmounted = false;
    setStateListLoading(true);

    axiosInstance
      .get(`${ADDRESS_URL}states/`)
      .then(res => {
        if (!unmounted) {
          setStateList(res.data);
          setStateListLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
        setStateListLoading(false);
      });

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <View style={styles.pickerWrapper}>
      {stateListLoading ? (
        <Picker style={styles.picker}>
          <Picker.Item label="Loading states ..." value={0} />
        </Picker>
      ) : stateList.length > 0 ? (
        <Picker
          style={styles.picker}
          selectedValue={values.state}
          mode="dropdown"
          onValueChange={(itemValue, itemIdex) =>
            setFieldValue('state', itemValue)
          }>
          <Picker.Item
            style={styles.pickerItem}
            key={0}
            label="Select State"
            value={0}
          />

          {stateList.map(state => (
            <Picker.Item
              style={styles.pickerItem}
              key={state.url}
              label={state.name}
              value={state}
            />
          ))}
        </Picker>
      ) : (
        <Text>No States</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerWrapper: {
    borderWidth: 1,
    width: 200,
    height: 56,
    padding: 0,
  },
  picker: {
    width: 200,
  },
  pickerItem: {
    padding: 0,
  },
});

export default StatePickerForm;
