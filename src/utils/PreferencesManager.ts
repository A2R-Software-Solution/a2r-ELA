/**
 * Preferences Manager
 * Handles local cache using AsyncStorage.
 * Firestore is the source of truth — AsyncStorage is a speed cache only.
 *
 * Installation: npm install @react-native-async-storage/async-storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class PreferencesManager {
  private static readonly PREFS_PREFIX = '@elearning_app:';

  // Keys
  private static readonly KEY_HAS_SEEN_INTRO =
    `${PreferencesManager.PREFS_PREFIX}has_seen_intro`;
  private static readonly KEY_USER_STATE =
    `${PreferencesManager.PREFS_PREFIX}user_state`;
  private static readonly KEY_USER_GRADE =
    `${PreferencesManager.PREFS_PREFIX}user_grade`;

  // --------------------------------------------------------------------------
  // INTRO
  // --------------------------------------------------------------------------

  async markIntroAsSeen(): Promise<void> {
    try {
      await AsyncStorage.setItem(PreferencesManager.KEY_HAS_SEEN_INTRO, 'true');
    } catch (error) {
      console.error('Error saving intro status:', error);
      throw error;
    }
  }

  async hasSeenIntro(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(PreferencesManager.KEY_HAS_SEEN_INTRO);
      return value === 'true';
    } catch (error) {
      console.error('Error reading intro status:', error);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // STATE & GRADE CACHE
  // Firestore is source of truth. These methods cache locally for speed.
  // Always sync from Firestore on app start via getUserPreferences API call.
  // --------------------------------------------------------------------------

  /**
   * Cache the user's selected state locally.
   * Call this AFTER successfully saving to Firestore.
   */
  async cacheUserState(state: string): Promise<void> {
    try {
      await AsyncStorage.setItem(PreferencesManager.KEY_USER_STATE, state);
    } catch (error) {
      console.error('Error caching user state:', error);
    }
  }

  /**
   * Cache the user's selected grade locally.
   * Call this AFTER successfully saving to Firestore.
   */
  async cacheUserGrade(grade: string): Promise<void> {
    try {
      await AsyncStorage.setItem(PreferencesManager.KEY_USER_GRADE, grade);
    } catch (error) {
      console.error('Error caching user grade:', error);
    }
  }

  /**
   * Cache both state and grade in a single operation.
   */
  async cacheUserPreferences(state: string, grade: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [PreferencesManager.KEY_USER_STATE, state],
        [PreferencesManager.KEY_USER_GRADE, grade],
      ]);
    } catch (error) {
      console.error('Error caching user preferences:', error);
    }
  }

  /**
   * Get cached state. Returns null if not cached — caller should
   * fetch from Firestore in that case.
   */
  async getCachedState(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(PreferencesManager.KEY_USER_STATE);
    } catch (error) {
      console.error('Error reading cached state:', error);
      return null;
    }
  }

  /**
   * Get cached grade. Returns null if not cached — caller should
   * fetch from Firestore in that case.
   */
  async getCachedGrade(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(PreferencesManager.KEY_USER_GRADE);
    } catch (error) {
      console.error('Error reading cached grade:', error);
      return null;
    }
  }

  /**
   * Get both cached state and grade in a single read.
   * Returns { state: null, grade: null } if not cached.
   */
  async getCachedPreferences(): Promise<{ state: string | null; grade: string | null }> {
    try {
      const results = await AsyncStorage.multiGet([
        PreferencesManager.KEY_USER_STATE,
        PreferencesManager.KEY_USER_GRADE,
      ]);
      return {
        state: results[0][1],
        grade: results[1][1],
      };
    } catch (error) {
      console.error('Error reading cached preferences:', error);
      return { state: null, grade: null };
    }
  }

  /**
   * Clear cached state and grade (e.g. on logout)
   */
  async clearCachedPreferences(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        PreferencesManager.KEY_USER_STATE,
        PreferencesManager.KEY_USER_GRADE,
      ]);
    } catch (error) {
      console.error('Error clearing cached preferences:', error);
    }
  }

  // --------------------------------------------------------------------------
  // GENERIC HELPERS
  // --------------------------------------------------------------------------

  async clearPreferences(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(
        key => key.startsWith(PreferencesManager.PREFS_PREFIX)
      );
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing preferences:', error);
      throw error;
    }
  }

  async saveString(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${PreferencesManager.PREFS_PREFIX}${key}`,
        value
      );
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  async getString(key: string, defaultValue: string = ''): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(
        `${PreferencesManager.PREFS_PREFIX}${key}`
      );
      return value ?? defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  async saveBoolean(key: string, value: boolean): Promise<void> {
    await this.saveString(key, value ? 'true' : 'false');
  }

  async getBoolean(key: string, defaultValue: boolean = false): Promise<boolean> {
    const value = await this.getString(key);
    if (value === '') return defaultValue;
    return value === 'true';
  }

  async saveNumber(key: string, value: number): Promise<void> {
    await this.saveString(key, value.toString());
  }

  async getNumber(key: string, defaultValue: number = 0): Promise<number> {
    const value = await this.getString(key);
    if (value === '') return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  async saveObject<T>(key: string, value: T): Promise<void> {
    try {
      await this.saveString(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving object ${key}:`, error);
      throw error;
    }
  }

  async getObject<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      const value = await this.getString(key);
      if (value === '') return defaultValue;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error reading object ${key}:`, error);
      return defaultValue;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(
        `${PreferencesManager.PREFS_PREFIX}${key}`
      );
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }
}

export default new PreferencesManager();