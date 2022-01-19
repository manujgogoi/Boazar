import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosInstance from '../../services/Axios';
import {PROFILE, USER_URL} from '../../utils/urls';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {format} from 'date-fns';
import ProfileView from './components/ProfileView';

const ProfileHomeScreen = ({navigation}) => {
  const [addresses, setAddresses] = useState([]);
  const isFocused = useIsFocused();
  const {userId} = useSelector(state => state.auth);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userStatus, setUserStatus] = useState('idle');

  // Get user details
  useEffect(() => {
    let unmounted = false;
    if (userId) {
      setUserLoading(true);
      axiosInstance
        .get(`${USER_URL}${userId}/`)
        .then(res => {
          if (!unmounted) {
            setUser(res.data);
            setUserStatus('succeeded');
          }
        })
        .catch(err => {
          console.log(err);
          setUserStatus('failed');
        })
        .finally(() => {
          setUserLoading(false);
        });
    }

    return () => {
      unmounted = true;
    };
  }, [isFocused, userId]);

  return (
    <View>
      {userLoading ? (
        <SkeletonPlaceholder>
          <View style={{flexDirection: 'column'}}>
            <View style={styles.textElement} />
            <View style={styles.textElement} />
            <View style={styles.textElement} />
            <View style={styles.textElement} />
          </View>
        </SkeletonPlaceholder>
      ) : userStatus === 'succeeded' ? (
        <ScrollView>
          <Text style={styles.textElement}>Email: {user.email}</Text>
          <Text style={styles.textElement}>Id: {user.id}</Text>
          <Text style={styles.textElement}>
            Joined Date: {format(new Date(user.date_joined), 'dd-MM-yyyy')}
          </Text>
          <Text style={styles.textElement}>
            Account status: {user.is_active ? 'Active' : 'Inactive'}
          </Text>
          {user.profile ? (
            <View>
              <ProfileView profileUrl={user.profile} navigation={navigation} />
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('AddDeliveryAddress', {
                    profileUrl: user.profile,
                  })
                }>
                <Text style={styles.buttonText}>Add new address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text>Profile does not exist</Text>
              <Button
                onPress={() => navigation.navigate('ProfileAdd')}
                title="Add Profile"
              />
            </View>
          )}
        </ScrollView>
      ) : (
        <Text>Some error occured. Please logout and login again</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#aaa',
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
  },
  textElement: {
    width: '100%',
    fontSize: 16,
    height: 30,
    margin: 5,
  },
});

export default ProfileHomeScreen;
