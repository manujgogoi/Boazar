/**
 * @format
 * @flow strict-local
 */
import React, {useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {format} from 'date-fns';

const DatePickerForm = props => {
  const {values, setFieldValue} = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // handlers
  // ================================================
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setFieldValue('birthday', format(date, 'dd-MM-yyyy'));
    hideDatePicker();
  };
  return (
    <View style={styles.dobWrapper}>
      <TextInput
        editable={false}
        style={styles.dobTextInput}
        value={values.birthday}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <TouchableOpacity style={styles.datePicker} onPress={showDatePicker}>
        <FAIcon name="calendar" color="#000" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dobWrapper: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },

  dobTextInput: {
    width: 150,
    margin: 0,
    height: 30,
    paddingVertical: 0,
    paddingLeft: 10,
  },

  datePicker: {
    width: 50,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
  },
});

export default DatePickerForm;
