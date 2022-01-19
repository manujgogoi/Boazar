import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground} from 'react-native';
import {Avatar} from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import {useSelector} from 'react-redux';
import axiosInstance from '../services/Axios';
import {USER_URL} from '../utils/urls';

const MyDrawer = props => {
  // Get Auth state
  const {userId, isLoggedIn, status} = useSelector(state => state.auth);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Get user details
  useEffect(() => {
    let unmounted = false;
    setUserLoading(true);
    if (userId) {
      axiosInstance
        .get(`${USER_URL}${userId}/`)
        .then(res => {
          if (!unmounted) {
            setUser(res.data);
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          setUserLoading(false);
        });
    }

    return () => {
      unmounted = true;
    };
  }, [userId]);

  // UI elements
  const UserEmail = () => {
    if (userLoading) {
      return <Text>User loading...</Text>;
    } else {
      return <Text>{user?.email}</Text>;
    }
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#fff'}}>
        <ImageBackground
          source={require('../assets/images/texture-background.jpg')}
          style={{padding: 20, marginTop: -5}}>
          <Avatar.Text size={80} label="AV" />
          <Text style={{color: '#eee', fontSize: 16}}>
            {status === 'pending' ? (
              'Loading...'
            ) : isLoggedIn ? (
              <UserEmail />
            ) : (
              ''
            )}
          </Text>
          <Text style={{color: '#eee'}}>Premium user</Text>
        </ImageBackground>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ddd'}}>
        <Text>Bottom Menu</Text>
        {status === 'pending' ? (
          <Text>Loading...</Text>
        ) : isLoggedIn ? (
          <UserEmail />
        ) : (
          <Text></Text>
        )}
      </View>
    </View>
  );
};

export default MyDrawer;
