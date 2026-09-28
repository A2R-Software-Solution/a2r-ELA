import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { glass } from '../../../theme/glass';

export const styles = StyleSheet.create({
  container: {
    ...glass.card,
    width: '94%',
    maxWidth: 920,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 43, 53, 0.82)',
    borderRadius: 28,
    marginTop: 8,
    paddingTop: 10,
    paddingHorizontal: 6,
  },
  sheen: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  tab: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrap: {
    width: 46,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.30)',
  },
  icon: { fontSize: 20 },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.muted,
    marginTop: 2,
  },
  labelSelected: { color: colors.text, fontWeight: '700' },
});
