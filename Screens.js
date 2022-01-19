/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text} from 'react-native';
import {Button, Badge, IconButton, Colors} from 'react-native-paper';
import {NavigationContainer, TouchableOpacity} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign';

import ProductsScreen from './src/features/products/ProductsScreen';
import LoginScreen from './src/features/auth/LoginScreen';
import RegisterScreen from './src/features/auth/RegisterScreen';
import ProfileScreen from './src/features/profile/ProfileScreen';
import HomeScreen from './src/features/home/HomeScreen';
import LogoutScreen from './src/features/auth/LogoutScreen';
import CartScreen from './src/features/cart/CartScreen';
import {useSelector, useDispatch} from 'react-redux';
import MyDrawer from './src/components/MyDrawer';
import {
  setAuth,
  removeAuth,
  getAuthTokensAsync,
  removeAuthTokensAsync,
} from './src/features/auth/authSlice';

import {getFromCartAsync} from './src/features/cart/cartSlice';
import jwt_decode from 'jwt-decode';

const Drawer = createDrawerNavigator();

const Screens = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const {isLoggedIn} = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getAuthTokensAsync())
      .unwrap()
      .then(res => {
        const refreshToken = res.refresh;
        const tokenParts = jwt_decode(refreshToken);
        const now = Math.ceil(Date.now() / 1000);
        if (tokenParts.exp < now) {
          dispatch(removeAuthTokensAsync())
            .unwrap()
            .then(res => {
              dispatch(removeAuth());
            })
            .catch(err => {
              console.log('Screens.js (Remove auth tokens async error) :', err);
            });
        } else {
          dispatch(setAuth(tokenParts.user_id));
        }
      })
      .catch(err => {
        console.log('Screens.js (Get auth Tokens Async error) :', err);
      });
  }, []);

  // ===================================================
  // Side effects to load cart data from AsyncStorage
  // ===================================================
  useEffect(() => {
    dispatch(getFromCartAsync());
  }, []);

  // ====================================================
  // Header Cart element
  // ====================================================
  const HeaderCart = ({navigation, route}) => {
    return (
      <View style={{margin: 5}}>
        <IconButton
          icon="cart"
          color={Colors.amber100}
          onPress={() => navigation.navigate('Cart')}
        />
        <Badge
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: Colors.amber100,
          }}>
          {cart.products.length}
        </Badge>
        {/* <Text>Cart: {cart.products.length}</Text> */}
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <MyDrawer {...props} />}
        initialRouteName="Home"
        screenOptions={({navigation, route}) => ({
          headerStyle: {
            backgroundColor: 'tomato',
          },
          headerTintColor: '#fff',
          headerRight: props => (
            <HeaderCart navigation={navigation} route={route} {...props} />
          ),
          drawerLabelStyle: {marginLeft: -25, fontSize: 15},
          drawerActiveBackgroundColor: 'tomato',
          drawerActiveTintColor: '#fff',
        })}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({color}) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Products"
          component={ProductsScreen}
          options={{
            drawerIcon: ({color}) => (
              <Ionicons name="grid-sharp" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Cart"
          component={CartScreen}
          options={{
            drawerIcon: ({color}) => (
              <FA5Icon name="shopping-cart" size={22} color={color} />
            ),
          }}
        />
        {isLoggedIn ? (
          <>
            <Drawer.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                drawerIcon: ({color}) => (
                  <AntIcon name="profile" size={22} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="Logout"
              component={LogoutScreen}
              options={{
                drawerIcon: ({color}) => (
                  <FA5Icon name="sign-out-alt" size={22} color={color} />
                ),
              }}
            />
          </>
        ) : (
          <>
            <Drawer.Screen
              name="Login"
              component={LoginScreen}
              options={{
                drawerIcon: ({color}) => (
                  <FA5Icon name="sign-in-alt" size={22} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                drawerIcon: ({color}) => (
                  <FA5Icon name="user-plus" size={22} color={color} />
                ),
              }}
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Screens;
