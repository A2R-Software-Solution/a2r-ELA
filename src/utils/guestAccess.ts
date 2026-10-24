/**
 * Guest Access
 * Anonymous (guest) users only get the free tier of the app (~20%);
 * everything else asks them to sign in.
 */

import { Alert } from 'react-native';
import { GameId } from '../models/GameModels';

/** Games a guest may play. Every other game requires an account. */
export const FREE_GAMES: ReadonlyArray<GameId> = ['stay_on_topic'];

export const isGameFree = (id: GameId): boolean => FREE_GAMES.includes(id);

/**
 * Tells the guest the feature is locked and offers to go to Sign In.
 */
export const promptSignIn = (
  onSignIn: () => void,
  feature = 'This feature',
): void => {
  Alert.alert(
    'Sign in to unlock 🔒',
    `${feature} is available with a free account.`,
    [
      { text: 'Not now', style: 'cancel' },
      { text: 'Sign In', onPress: onSignIn },
    ],
  );
};
