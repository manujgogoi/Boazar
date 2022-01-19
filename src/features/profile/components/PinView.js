/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import axiosInstance from '../../../services/Axios';

const PinView = ({pinUrl, style}) => {
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Get district detail
  useEffect(() => {
    let unmounted = false;
    if (pinUrl) {
      setLoading(true);
      setStatus('pending');

      // Get District from server
      axiosInstance
        .get(pinUrl)
        .then(res => {
          if (!unmounted) {
            setPin(res.data);
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
    };
  }, [pinUrl]);
  return (
    <Text>
      {loading ? (
        <SkeletonPlaceholder>
          <View style={{width: 30, height: 25}}></View>
        </SkeletonPlaceholder>
      ) : status === 'succeeded' ? (
        <Text>{pin.code && pin.code}</Text>
      ) : status === 'failed' ? (
        <Text>Loading failed!</Text>
      ) : (
        <Text></Text>
      )}
    </Text>
  );
};

export default PinView;
