/**
 * Storage utilities for localStorage operations
 */

// Save data to localStorage
export function saveToStorage<T>(key: string, data: T): void {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving to localStorage with key "${key}":`, error);
  }
}

// Load data from localStorage
export function loadFromStorage<T>(key: string): T | null {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Error loading from localStorage with key "${key}":`, error);
    return null;
  }
}

// Remove data from localStorage
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage with key "${key}":`, error);
  }
}

// Clear all app data from localStorage
export function clearAllStorage(keys: string[]): void {
  try {
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// Check if localStorage is available
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Get storage usage information
export function getStorageInfo(): { used: number; total: number; available: number } {
  try {
    let used = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // Estimate total storage (typically 5-10MB, we'll use 5MB as conservative estimate)
    const total = 5 * 1024 * 1024; // 5MB in bytes
    const available = total - used;
    
    return { used, total, available };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, total: 0, available: 0 };
  }
}
