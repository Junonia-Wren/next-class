import { openDB } from "idb";

export const dbPromise = openDB("nextclass-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("schedule")) {
      db.createObjectStore("schedule");
    }
    if (!db.objectStoreNames.contains("tasks")) {
      db.createObjectStore("tasks");
    }
    if (!db.objectStoreNames.contains("subjects")) {
      db.createObjectStore("subjects");
    }
  },
});
