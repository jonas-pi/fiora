/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Provider } from 'react-redux';
import AppInitializer from './src/components/AppInitializer';
import store from './src/state/store';

export default function Main(props: any) {
    return (
        <Provider store={store}>
            <AppInitializer {...props} />
        </Provider>
    );
}
