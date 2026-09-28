import { colors } from '../../../theme/colors';
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: colors.text,
    minHeight: 300,
    ...Platform.select({
      ios: {
        fontFamily: 'Georgia',
      },
      android: {
        fontFamily: 'serif',
      },
    }),
  },
});
