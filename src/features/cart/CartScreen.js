/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import CartListScreen from './CartListScreen';
import CheckoutScreen from './CheckoutScreen';
import OrderScreen from './OrderScreen';

const Stack = createNativeStackNavigator();

const CartScreen = ({navigation}) => {
  const {isLoggedIn} = useSelector(state => state.auth);

  // Hide parent Header
  //=======================================================
  React.useLayoutEffect(() => {
    navigation.setOptions({
      // headerShown: false,
    });
  }, [navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CartList"
        component={CartListScreen}
        options={{headerShown: false}}
      />
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Order" component={OrderScreen} />
        </>
      ) : (
        <></>
      )}
    </Stack.Navigator>
  );
};

export default CartScreen;
