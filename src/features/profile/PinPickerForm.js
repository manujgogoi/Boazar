/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axiosInstance from '../../services/Axios';
import {ADDRESS_URL} from '../../utils/urls';

const PinPickerForm = props => {
  const {values, setFieldValue} = props;
  const [pinList, setPinList] = useState([]);
  const [pinListLoading, setPinListLoading] = useState(false);

  // Get Pin list on select district
  // ======================================================
  useEffect(() => {
    let unmounted = false;
    setPinListLoading(true);
    if (values.district?.pin_codes?.length > 0) {
      // Get all pin codes of selected district
      axiosInstance
        .get(`${ADDRESS_URL}districts/${values.district.id}/pins/`)
        .then(res => {
          setPinList(res.data);
          setPinListLoading(false);
        })
        .catch(err => {
          console.log(err);
          setPinListLoading(false);
        });
    } else {
      setPinList([]);
    }
    setPinListLoading(false);
  }, [values.district]);

  return (
    <View style={styles.pickerWrapper}>
      {pinListLoading ? (
        <Text>Loading...</Text>
      ) : pinList.length > 0 ? (
        <Picker
          style={styles.picker}
          selectedValue={values.pin}
          onValueChange={(itemValue, itemIdex) =>
            setFieldValue('pin', itemValue)
          }>
          <Picker.Item
            style={styles.pickerItem}
            label="Select PIN Code"
            value={0}
          />
          {pinList.length > 0 ? (
            pinList.map(pin => (
              <Picker.Item
                style={styles.pickerItem}
                key={pin.url}
                label={pin.code}
                value={pin}
              />
            ))
          ) : (
            <Text>--empty--</Text>
          )}
        </Picker>
      ) : (
        <Picker style={styles.picker}>
          <Picker.Item style={styles.pickerItem} label="No PINs" value={0} />
        </Picker>
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

export default PinPickerForm;
