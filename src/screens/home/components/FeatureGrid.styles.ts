import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EDE9FF',
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 6,
    paddingRight: 4,
  },
  item: {
    alignItems: 'center',
    width: 66,
  },
  glowWrap: {
    borderRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 0,
    marginBottom: 9,
  },
  iconBubble: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  emoji: {
    fontSize: 26,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
