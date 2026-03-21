/**
 * profileEvents
 * Minimal event emitter for cross-hook communication.
 *
 * Used to notify useHome when the user saves a new display name in
 * useProfile — without triggering a full profile reload or needing
 * a global state manager like Redux/Zustand.
 *
 * Usage:
 *   Emit:    profileEvents.emit('nameChanged')
 *   Listen:  profileEvents.on('nameChanged', callback)
 *   Unlisten: profileEvents.off('nameChanged', callback)
 */

type EventName = 'nameChanged';
type Listener = () => void;

class ProfileEvents {
  private listeners: Map<EventName, Set<Listener>> = new Map();

  on(event: EventName, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: EventName, listener: Listener): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit(event: EventName): void {
    this.listeners.get(event)?.forEach(listener => listener());
  }
}

// Singleton — same instance shared across all hook usages
export const profileEvents = new ProfileEvents();