/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axiosInstance from '../../services/Axios';
import {ADDRESS_URL} from '../../utils/urls';

const VillOrTownPickerForm = props => {
  const {values, setFieldValue} = props;
  const [villOrTownList, setVillOrTownList] = useState([]);
  const [villOrTownListLoading, setVillOrTownListLoading] = useState(false);

  // ======================================================
  // Get villagesOrTown list on select PIN
  // ======================================================
  useEffect(() => {
    let unmounted = false;
    setVillOrTownListLoading(true);
    if (values.pin?.villages_or_towns?.length > 0) {
      // Get all Villages or towns of selected Pin
      axiosInstance
        .get(`${ADDRESS_URL}PINs/${values.pin.id}/villages_or_towns/`)
        .then(res => {
          setVillOrTownList(res.data);
          setVillOrTownListLoading(false);
        })
        .catch(err => {
          console.log(err);
          setVillOrTownListLoading(false);
        });
    } else {
      setVillOrTownList([]);
    }
    setVillOrTownListLoading(false);
  }, [values.pin]);

  return (
    <View style={styles.pickerWrapper}>
      {villOrTownListLoading ? (
        <Text>Loading...</Text>
      ) : villOrTownList.length > 0 ? (
        <Picker
          style={styles.picker}
          selectedValue={values.village_or_town}
          onValueChange={(itemValue, itemIdex) =>
            setFieldValue('village_or_town', itemValue)
          }>
          <Picker.Item
            style={styles.pickerItem}
            label="Select Village or Town"
            value={0}
          />
          {villOrTownList.length > 0 ? (
            villOrTownList.map(villOrTown => (
              <Picker.Item
                style={styles.pickerItem}
                key={villOrTown.url}
                label={villOrTown.name}
                value={villOrTown}
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
            label="No Village or Town"
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

export default VillOrTownPickerForm;
