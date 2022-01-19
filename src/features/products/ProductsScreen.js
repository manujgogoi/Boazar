/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProductsListScreen from './ProductsListScreen';
import ProductDetailsScreen from './ProductDetailsScreen';

const Stack = createNativeStackNavigator();

const ProductsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductsList"
        component={ProductsListScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};

export default ProductsScreen;
