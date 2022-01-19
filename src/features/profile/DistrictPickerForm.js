/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axiosInstance from '../../services/Axios';
import {ADDRESS_URL} from '../../utils/urls';

const DistrictPickerForm = props => {
  const {values, setFieldValue} = props;
  const [districtList, setDistrictList] = useState([]);
  const [districtListLoading, setDistrictListLoading] = useState(false);
  // Get District list on select state
  // ======================================================
  useEffect(() => {
    let unmounted = false;
    setDistrictListLoading(true);
    if (values.state?.districts?.length > 0) {
      //get all Districts of selected state
      axiosInstance
        .get(`${ADDRESS_URL}states/${values.state.id}/districts/`)
        .then(res => {
          setDistrictList(res.data);
          setDistrictListLoading(false);
        })
        .catch(err => {
          console.log(err);
          setDistrictListLoading(false);
        });
    } else {
      setDistrictList([]);
    }
    setDistrictListLoading(false);
  }, [values.state]);

  return (
    <View style={styles.pickerWrapper}>
      {districtListLoading ? (
        <Text>Loading...</Text>
      ) : districtList.length > 0 ? (
        <Picker
          style={styles.picker}
          selectedValue={values.district}
          onValueChange={(itemValue, itemIdex) =>
            setFieldValue('district', itemValue)
          }>
          <Picker.Item
            style={styles.pickerItem}
            label="Select a district"
            value={0}
          />
          {districtList.length > 0 ? (
            districtList.map(dist => (
              <Picker.Item
                style={styles.pickerItem}
                key={dist.url}
                label={dist.name}
                value={dist}
              />
            ))
          ) : (
            <Text>--empty--</Text>
          )}
        </Picker>
      ) : (
        <Picker style={styles.picker}>
          <Picker.Item
            style={styles.pickerItem}
            label="No districts"
            value={0}
          />
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

export default DistrictPickerForm;
