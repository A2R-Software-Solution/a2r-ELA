import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 18,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: '#757575',
  },
  statusText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#F44336',
  },
  removeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 18,
    color: '#757575',
    fontWeight: '600',
  },
});
