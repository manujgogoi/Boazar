/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {store} from './src/app/store';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import Screens from './Screens';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: 'tomato',
    // accent: 'yellow',
  },
};

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor="#cc5236"
          translucent={false}
        />
        <Screens />
      </PaperProvider>
    </Provider>
  );
};

export default App;
