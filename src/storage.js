/**
 * Persistent storage using localStorage.
 *
 * This replaces the Claude artifact `window.storage` API with
 * standard browser localStorage so the app works on any host.
 *
 * To upgrade to a backend database later (Firebase, Supabase, etc.),
 * swap the implementations in this file — the rest of the app
 * imports these functions and doesn't care where data lives.
 */

const PREFIX = 'aiethics_';

export async function loadStorage(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveStorage(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
}

export async function removeStorage(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (e) {
    console.error('Storage remove failed:', e);
  }
}

export const STORAGE_KEYS = {
  progress: 'progress',
  journal: 'journal',
  syllabus: 'syllabus',
};
