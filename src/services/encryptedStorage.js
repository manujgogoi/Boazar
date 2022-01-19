/**
 * @format
 * @flow strict-local
 */

import EncryptedStorage from 'react-native-encrypted-storage';

export const storeTokens = async (access, refresh) => {
  try {
    await EncryptedStorage.setItem(
      'tokens',
      JSON.stringify({access: access, refresh: refresh}),
    );
  } catch (error) {
    console.log('Set tokens error: ', error);
  }
};

export const getTokens = async () => {
  try {
    const tokens = await EncryptedStorage.getItem('tokens');
    if (tokens !== undefined) {
      return JSON.parse(tokens);
    }
  } catch (error) {
    console.log('Get tokens error: ', error);
  }
};

export const removeTokens = async () => {
  try {
    await EncryptedStorage.removeItem('tokens');
  } catch (error) {
    console.log('Remove tokens error: ', error);
  }
};

export const clearStorage = async () => {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    console.log('Clear tokens error: ', error);
  }
};
