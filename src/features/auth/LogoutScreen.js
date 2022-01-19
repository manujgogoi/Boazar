/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import {removeAuthTokensAsync, removeAuth} from './authSlice';

const LogoutScreen = () => {
  const dispatch = useDispatch();

  // Event handlers
  // ==============================================
  const handleLogout = () => {
    dispatch(removeAuthTokensAsync())
      .unwrap()
      .then(res => {
        dispatch(removeAuth());
      })
      .catch(err => {
        console.log('LogoutScreen.js (Remove auth Tokens async error) :', err);
      });
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 20}}>Logout Screen</Text>
      <Button title={'Logout'} onPress={handleLogout} />
    </View>
  );
};

export default LogoutScreen;
