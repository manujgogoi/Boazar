/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import axiosInstance from '../../../services/Axios';
import StateView from './StateView';
import DistrictView from './DistrictView';
import PinView from './PinView';
import VillOrTownView from './VillOrTownView';

const AddressView = ({profile}) => {
  return (
    <View>
      <Text>House No: {profile.house_no}</Text>
      <Text>Landmark: {profile.landmark}</Text>
      <Text>Phone No: {profile.phone_number}</Text>
      <VillOrTownView villOrTownUrl={profile.village_or_town} />
      <PinView pinUrl={profile.pin_code} />
      <DistrictView districtUrl={profile.district} />
      <StateView stateUrl={profile.state} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default AddressView;
