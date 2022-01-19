/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {USER_URL, PROFILE_URL} from '../../utils/urls';
import axiosInstance from '../../services/Axios';
import StateView from '../profile/components/StateView';
import DistrictView from '../profile/components/DistrictView';
import PinView from '../profile/components/PinView';
import VillOrTownView from '../profile/components/VillOrTownView';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// =============================================================
// Vendor View
// =============================================================
const VendorView = ({vendorUrl}) => {
  const [vendor, setVendor] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;
    if (vendorUrl) {
      setLoading(true);
      axiosInstance
        .get(vendorUrl)
        .then(res => {
          if (!unmounted) {
            setVendor(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => setLoading(false));
    }

    return () => {
      unmounted = true;
    };
  }, [vendorUrl]);

  return <Text>{loading ? 'Loading vendor' : vendor?.name}</Text>;
};

// =============================================================
// Image View
// =============================================================
const ImageView = ({imageUrl}) => {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;
    if (imageUrl) {
      setLoading(true);
      axiosInstance
        .get(imageUrl)
        .then(res => {
          setImage(res.data);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {
      unmounted = true;
    };
  }, [imageUrl]);
  return (
    <View>
      {loading ? (
        <SkeletonPlaceholder>
          <View style={{width: 100, height: 100, resizeMode: 'cover'}}></View>
        </SkeletonPlaceholder>
      ) : (
        <Image
          style={{width: 100, height: 100, resizeMode: 'cover'}}
          source={{uri: image?.image}}
        />
      )}
    </View>
  );
};

// =============================================================
// Delivery address view
// =============================================================
const DeliveryAddressView = ({addressUrl, navigation}) => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;
    setLoading(true);
    axiosInstance
      .get(addressUrl)
      .then(res => {
        if (!unmounted) {
          setAddress(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      unmounted = true;
    };
  }, [addressUrl]);

  // Event handlers
  const selectAddressHandler = () => {
    navigation.navigate('Order', {addressUrl: addressUrl});
  };

  return (
    <View style={{backgroundColor: '#ddd', margin: 10}}>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={{
            width: 60,
            backgroundColor: 'skyblue',
            paddingVertical: 5,
            marginRight: 5,
            alignItems: 'center',
          }}
          onPress={selectAddressHandler}>
          <Text style={{textTransform: 'uppercase'}}>Select</Text>
        </TouchableOpacity>
        <Text style={{flex: 1}}>
          House No: {address.house_no}, Landmark: {address.landmark}, Village/
          Town: <VillOrTownView villOrTownUrl={address.village_or_town} />,{' '}
          <DistrictView districtUrl={address.district} />,{' '}
          <StateView stateUrl={address.state} />,{' '}
          <PinView pinUrl={address.pin_code} />
        </Text>
      </View>
    </View>
  );
};

// =============================================================
// CheckoutScreen
// =============================================================
const CheckoutScreen = ({navigation}) => {
  const {userId} = useSelector(state => state.auth);
  const {products} = useSelector(state => state.cart);
  const [user, setUser] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  const [userProfile, setUserProfile] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Get user detail
  useEffect(() => {
    let unmounted = false;
    if (userId) {
      setUserLoading(true);
      axiosInstance
        .get(`${USER_URL}${userId}`)
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
      setUserLoading(false);
    };
  }, []);

  // Get user profile
  useEffect(() => {
    let unmounted = false;
    if (user?.profile) {
      setProfileLoading(true);
      axiosInstance
        .get(user.profile)
        .then(res => {
          if (!unmounted) {
            setUserProfile(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setProfileLoading(false);
        });
    }
    return () => {
      unmounted = true;
      setProfileLoading(false);
    };
  }, [user]);

  return (
    <ScrollView>
      {userLoading ? (
        <Text>Loading User...</Text>
      ) : (
        <View>
          {user.profile ? (
            profileLoading ? (
              <Text>Loading profile data</Text>
            ) : (
              <View>
                <View>
                  <Text>Select Delivery Address: </Text>
                  {userProfile.delivery_addresses.length > 0 ? (
                    userProfile.delivery_addresses.map(address => (
                      <DeliveryAddressView
                        key={address}
                        addressUrl={address}
                        navigation={navigation}
                      />
                    ))
                  ) : (
                    <Text>No address</Text>
                  )}
                </View>
              </View>
            )
          ) : (
            <Text>No profile found</Text>
          )}
        </View>
      )}
      <View>
        <Text>Items:</Text>
        {products.length > 0 ? (
          products.map(product => (
            <View key={product.url}>
              <View>
                <Text>{product.title}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                {product.images.length > 0 ? (
                  <View>
                    <ImageView imageUrl={product.images[0]} />
                  </View>
                ) : (
                  <Text>No image</Text>
                )}

                <View>
                  <Text>Price: {product.regular_price}</Text>
                  <Text>Quantity: {product.quantity}</Text>
                  <Text>Total: {product.regular_price * product.quantity}</Text>
                  <Text>
                    Vendor: <VendorView vendorUrl={product.vendor} />
                  </Text>
                </View>
              </View>
              {/* <Text>{JSON.stringify(product)}</Text> */}
            </View>
          ))
        ) : (
          <Text>No products</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default CheckoutScreen;
