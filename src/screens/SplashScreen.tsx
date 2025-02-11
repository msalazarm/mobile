import React, {useContext, useEffect} from 'react';
import * as NavigationService from '../NavigationService';
import {StackActions} from '@react-navigation/native';
import {Image, StatusBar, StyleSheet, View} from 'react-native';
import {CurrentFiroTheme} from '../Themes';
import {FiroContext} from '../FiroContext';
import {firoElectrum} from '../core/FiroElectrum';
import {Currency} from '../utils/currency';
import {AppStorage} from '../app-storage';
import {CoreSettings} from '../core/CoreSettings';
import Logger from '../utils/logger';

const {colors} = CurrentFiroTheme;

const SplashScreen = () => {
  const {isStorageEncrypted, setSettings} = useContext(FiroContext);

  const replaceStackNavigation = async () => {
    let coreSettings: CoreSettings | undefined;
    try {
      coreSettings = JSON.parse(
        await new AppStorage().getItem(AppStorage.SETTINGS),
      );
      if (coreSettings) {
        await setSettings(coreSettings, true);
      }
    } catch (error) {}
    await Currency.setCurrentCurrency(
      coreSettings ? coreSettings.defaultCurrency : 'usd',
    );
    if (await isStorageEncrypted()) {
      NavigationService.dispatch(StackActions.replace('EnterWallet'));
    } else {
      NavigationService.dispatch(StackActions.replace('CreateWallet'));
    }
  };

  useEffect(() => {
    try {
      firoElectrum.connectMain();
      replaceStackNavigation();
    } catch (e) {
      Logger.error('splash_screen', e);
    }
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={colors.primary} barStyle={"light-content"} />
      <Image style={styles.logo} source={require('../img/firo-logo.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.primary,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 232,
    height: 82,
  },
});

export default SplashScreen;
