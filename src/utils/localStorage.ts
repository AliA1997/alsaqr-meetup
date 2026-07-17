
export default class LocalStorage {

    getEventToView(key: string='eventToViewId'): string | null {
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        try {
            return stored;
        } catch {
            localStorage.removeItem(key);
            return null;
        }
    }
    
    setEventToViewId(eventToViewId: string) {
        localStorage.setItem("eventToViewId", eventToViewId);
    }
    clearEventToViewId() {
        localStorage.removeItem("eventToViewId");
    }
    
    getGroupToView(key: string='groupToViewId'): string | null {
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        try {
            return stored;
        } catch {
            localStorage.removeItem(key);
            return null;
        }
    }

    setGroupToViewId(groupToViewId: string) {
        localStorage.setItem("groupToViewId", groupToViewId);
    }
    clearGroupToViewId() {
        localStorage.removeItem("groupToViewId");
    }
}