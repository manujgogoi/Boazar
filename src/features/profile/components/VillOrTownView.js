/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import axiosInstance from '../../../services/Axios';

const VillOrTownView = ({villOrTownUrl, style}) => {
  const [villOrTown, setVillOrTown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Get district detail
  useEffect(() => {
    let unmounted = false;
    if (villOrTownUrl) {
      setLoading(true);
      setStatus('pending');

      // Get District from server
      axiosInstance
        .get(villOrTownUrl)
        .then(res => {
          if (!unmounted) {
            setVillOrTown(res.data);
            setStatus('succeeded');
          }
        })
        .catch(err => {
          setError(err);
          setStatus('failed');
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {
      unmounted = true;
      setVillOrTown(null);
    };
  }, [villOrTownUrl]);
  return (
    <Text>
      {loading ? (
        <SkeletonPlaceholder>
          <View style={{width: 30, height: 25}} />
        </SkeletonPlaceholder>
      ) : status === 'succeeded' ? (
        <Text>{villOrTown.name}</Text>
      ) : status === 'failed' ? (
        <Text>Loading failed!</Text>
      ) : (
        <Text></Text>
      )}
    </Text>
  );
};

export default VillOrTownView;
