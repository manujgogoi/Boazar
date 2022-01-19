import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileHomeScreen from './ProfileHomeScreen';
import ProfileEditScreen from './ProfileEditScreen';
import ProfileAddScreen from './ProfileAddScreen';
import ProfilePhotoScreen from './ProfilePhotoScreen';
import AddDeliveryAddressScreen from './AddDeliveryAddressScreen';

const Stack = createNativeStackNavigator();

const ProfileScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="ProfileAdd" component={ProfileAddScreen} />
      <Stack.Screen name="ProfilePhoto" component={ProfilePhotoScreen} />
      <Stack.Screen
        name="AddDeliveryAddress"
        component={AddDeliveryAddressScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileScreen;
