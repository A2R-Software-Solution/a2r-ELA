/**
 * Preferences Manager
 * Handles local storage using AsyncStorage (React Native equivalent of SharedPreferences)
 * 
 * Installation required: npm install @react-native-async-storage/async-storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class PreferencesManager {
  private static readonly PREFS_PREFIX = '@elearning_app:';
  private static readonly KEY_HAS_SEEN_INTRO = `${PreferencesManager.PREFS_PREFIX}has_seen_intro`;

  /**
   * Mark intro as seen
   */
  async markIntroAsSeen(): Promise<void> {
    try {
      await AsyncStorage.setItem(PreferencesManager.KEY_HAS_SEEN_INTRO, 'true');
    } catch (error) {
      console.error('Error saving intro status:', error);
      throw error;
    }
  }

  /**
   * Check if user has seen intro
   */
  async hasSeenIntro(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(PreferencesManager.KEY_HAS_SEEN_INTRO);
      return value === 'true';
    } catch (error) {
      console.error('Error reading intro status:', error);
      return false;
    }
  }

  /**
   * Clear all preferences
   */
  async clearPreferences(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(PreferencesManager.PREFS_PREFIX));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing preferences:', error);
      throw error;
    }
  }

  /**
   * Generic save method for future preferences
   */
  async saveString(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`${PreferencesManager.PREFS_PREFIX}${key}`, value);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  /**
   * Generic get method for future preferences
   */
  async getString(key: string, defaultValue: string = ''): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(`${PreferencesManager.PREFS_PREFIX}${key}`);
      return value || defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Save boolean value
   */
  async saveBoolean(key: string, value: boolean): Promise<void> {
    await this.saveString(key, value ? 'true' : 'false');
  }

  /**
   * Get boolean value
   */
  async getBoolean(key: string, defaultValue: boolean = false): Promise<boolean> {
    const value = await this.getString(key);
    if (value === '') return defaultValue;
    return value === 'true';
  }

  /**
   * Save number value
   */
  async saveNumber(key: string, value: number): Promise<void> {
    await this.saveString(key, value.toString());
  }

  /**
   * Get number value
   */
  async getNumber(key: string, defaultValue: number = 0): Promise<number> {
    const value = await this.getString(key);
    if (value === '') return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Save object as JSON
   */
  async saveObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.saveString(key, jsonValue);
    } catch (error) {
      console.error(`Error saving object ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get object from JSON
   */
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

  /**
   * Remove specific key
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${PreferencesManager.PREFS_PREFIX}${key}`);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export default new PreferencesManager();