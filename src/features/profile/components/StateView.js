/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import axiosInstance from '../../../services/Axios';

const StateView = ({stateUrl, style}) => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Get State Detail
  useEffect(() => {
    let unmounted = false;
    if (stateUrl) {
      setLoading(true);
      setStatus('pending');

      // Get State from server
      axiosInstance
        .get(stateUrl)
        .then(res => {
          if (!unmounted) {
            setState(res.data);
            setStatus('succeeded');
          }
        })
        .catch(err => {
          setError(err);
          console.log(err);
          setStatus('failed');
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {
      unmounted = true;
    };
  }, [stateUrl]);
  return (
    <Text>
      {loading ? (
        <SkeletonPlaceholder>
          <View style={{width: 30, height: 25}}></View>
        </SkeletonPlaceholder>
      ) : status === 'succeeded' ? (
        <Text>{state.name && state.name}</Text>
      ) : status === 'failed' ? (
        <Text>Loading failed!</Text>
      ) : (
        <Text></Text>
      )}
    </Text>
  );
};

export default StateView;
