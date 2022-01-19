/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import axiosInstance from '../../../services/Axios';

const DistrictView = ({districtUrl, style}) => {
  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Get district detail
  useEffect(() => {
    let unmounted = false;
    if (districtUrl) {
      setLoading(true);
      setStatus('pending');

      // Get District from server
      axiosInstance
        .get(districtUrl)
        .then(res => {
          if (!unmounted) {
            setDistrict(res.data);
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
  }, [districtUrl]);
  return (
    <Text>
      {loading ? (
        <SkeletonPlaceholder>
          <View style={{width: 30, height: 25}}></View>
        </SkeletonPlaceholder>
      ) : status === 'succeeded' ? (
        <Text>{district.name && district.name}</Text>
      ) : status === 'failed' ? (
        <Text>Loading failed!</Text>
      ) : (
        <Text></Text>
      )}
    </Text>
  );
};

export default DistrictView;
