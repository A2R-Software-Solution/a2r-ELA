/**
 * tabEvents
 * Lightweight event emitter for cross-screen tab switching.
 *
 * Pattern mirrors profileEvents.ts exactly.
 *
 * Usage:
 *   Emit  (from EssayEditorScreen via useEssayEditor):
 *     tabEvents.emit('switchTab', HomeTab.PLAYGROUND)
 *
 *   Listen (in HomeScreen):
 *     tabEvents.on('switchTab', (tab) => onTabSelected(tab))
 *     tabEvents.off('switchTab', handler)   ← cleanup on unmount
 *
 * Why not navigation params?
 *   EssayEditorScreen is a separate stack screen — it can't directly
 *   call HomeScreen's internal onTabSelected(). An event emitter is
 *   the lightest bridge with zero changes to RootStackParamList.
 */

type TabEventName = 'switchTab';
type TabEventHandler = (tab: string) => void;

class TabEvents {
  private listeners: Map<TabEventName, Set<TabEventHandler>> = new Map();

  /**
   * Subscribe to a tab event.
   * Call off() with the same handler reference to unsubscribe.
   */
  on(event: TabEventName, handler: TabEventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  /**
   * Unsubscribe from a tab event.
   * Always call this in useEffect cleanup to avoid memory leaks.
   */
  off(event: TabEventName, handler: TabEventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }

  /**
   * Emit a tab event to all registered listeners.
   */
  emit(event: TabEventName, tab: string): void {
    this.listeners.get(event)?.forEach(handler => handler(tab));
  }
}

export const tabEvents = new TabEvents();