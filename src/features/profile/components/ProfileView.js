/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AntIcon from 'react-native-vector-icons/AntDesign';
import axiosInstance from '../../../services/Axios';
import StateView from './StateView';
import DistrictView from './DistrictView';
import PinView from './PinView';
import VillOrTownView from './VillOrTownView';

const DeliveryAddress = ({addressUrl, profile}) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;
    setLoading(true);
    axiosInstance
      .get(addressUrl)
      .then(res => {
        if (!unmounted) {
          setAddress(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
      });

    return () => {
      unmounted = true;
    };
  }, [profile]);
  return (
    <View>
      {loading ? (
        <Text>Loading address...</Text>
      ) : (
        <View>
          <Text>
            House No. {address.house_no}, Landmark: {address.landmark},
            <VillOrTownView villOrTownUrl={address.village_or_town} />
            <PinView pinUrl={address.pinUrl} />,
            <DistrictView districtUrl={address.district} />,
            <StateView stateUrl={address.state} />
          </Text>
        </View>
      )}
    </View>
  );
};

const ProfileView = ({profileUrl, navigation}) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const [refresh, setRefresh] = useState(false);

  // Toggle refresh is used to update profile
  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

  // Get profile detail
  useEffect(() => {
    let unmounted = false;
    if (profileUrl) {
      setLoading(true);
      setStatus('pending');

      axiosInstance
        .get(profileUrl)
        .then(res => {
          if (!unmounted) {
            setProfile(res.data);
            setStatus('succeeded');
          }
        })
        .catch(err => {
          if (!unmounted) {
            setError(err);
            setStatus('failed');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {
      unmounted = true;
    };
  }, [refresh]);

  // ========================================================
  // Event Handlers
  // ========================================================
  const handleDeleteDeliveryAddress = (profile, address) => {
    // Delete delivery address
    axiosInstance
      .delete(address)
      .then(res => {
        toggleRefresh();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View>
      {loading ? (
        // Profile loading skeleton
        // ==================================
        <SkeletonPlaceholder>
          <View style={styles.profileContainer}>
            <View style={styles.profilePhotoWrapper}>
              <View style={styles.profilePhoto} />
            </View>
            <View style={styles.profileName}></View>
            <View style={styles.profileAddress}>
              <View style={styles.text} />
              <View style={styles.text} />
              <View style={styles.text} />
            </View>
          </View>
        </SkeletonPlaceholder>
      ) : status === 'succeeded' ? (
        // Profile content
        // ===================================
        <View>
          <View style={styles.profileContainer}>
            <View style={styles.profilePhotoWrapper}>
              {profile.photo ? (
                <Image
                  style={styles.profilePhoto}
                  source={{uri: profile.photo}}
                />
              ) : (
                <View
                  style={[styles.profilePhoto, styles.profilePhotoPlaceholder]}>
                  <Text>No Photo</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('ProfilePhoto', {profile: profile})
              }>
              <Text style={{color: '#fff', textTransform: 'uppercase'}}>
                Profile Photo
              </Text>
            </TouchableOpacity>
            <Text>Name: </Text>
            <Text style={styles.profileName}>
              {profile.first_name} {profile.middle_name && profile.middle_name}{' '}
              {profile.last_name}
            </Text>
            <Text>Phone Number: </Text>
            <Text style={styles.text}>{profile.phone_number}</Text>
            <View style={styles.profileAddress}>
              <Text style={[styles.text, styles.headingText]}>Address</Text>
              <Text>House No: </Text>
              <Text style={styles.text}>{profile.house_no}</Text>
              <Text>Landmark: </Text>
              <Text style={styles.text}>{profile.landmark}</Text>

              <Text>Village/Town</Text>
              <VillOrTownView
                style={styles.text}
                villOrTownUrl={profile.village_or_town}
              />
              <Text>PIN Code: </Text>
              <PinView style={styles.text} pinUrl={profile.pin_code} />
              <Text>District: </Text>
              <DistrictView
                style={styles.text}
                districtUrl={profile.district}
              />
              <Text>State: </Text>
              <StateView style={styles.text} stateUrl={profile.state} />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('ProfileEdit', {profile: profile})
              }>
              <Text style={[styles.buttonText, {color: '#fff'}]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <Text style={[styles.text, styles.headingText]}>
              Delivery Addresses
            </Text>
            {profile?.delivery_addresses.length > 0 ? (
              profile?.delivery_addresses.map(address => (
                <View key={address} style={styles.deliveryAddressWrapper}>
                  <View style={styles.deliveryAddress}>
                    <DeliveryAddress
                      addressUrl={address}
                      profileUrl={profile}
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        Alert.alert(
                          'Confirm delete?',
                          'Are you sure to delete this address',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Confirm',
                              onPress: () =>
                                handleDeleteDeliveryAddress(profile, address),
                            },
                          ],
                        )
                      }>
                      <AntIcon name="delete" size={30} color="#ff0000" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text>No delivery addresses</Text>
            )}
          </View>
        </View>
      ) : status === 'failed' ? (
        // Failed to load content
        // ===================================
        <View>
          <Text>Failed to load profile</Text>
        </View>
      ) : (
        // Idle (Before loading content)
        <View>
          <Text></Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    marginHorizontal: 10,
  },

  profilePhotoWrapper: {
    marginBottom: 10,
  },

  profilePhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'cover',
  },

  profilePhotoPlaceholder: {
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileName: {
    width: 350,
    height: 30,
    fontSize: 18,
  },
  text: {
    width: 350,
    height: 30,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#aaa',
    margin: 10,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    textTransform: 'uppercase',
  },
  headingText: {
    borderBottomWidth: 2,
  },
  deliveryAddressWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  deliveryAddress: {
    width: 300,
  },
  deleteButton: {},
});

export default ProfileView;
