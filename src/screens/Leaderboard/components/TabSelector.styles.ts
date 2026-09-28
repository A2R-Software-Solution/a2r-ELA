import { colors } from '../../../theme/colors';
import { layout } from '../../../theme/layout';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;

export const styles = StyleSheet.create({
  container: {
    ...layout.content,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: colors.surface,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  activeTabText: {
    color: PURPLE,
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 32,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
});
