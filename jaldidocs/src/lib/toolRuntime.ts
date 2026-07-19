export function readLocalDraft<T>(key: string, fallback: T, validate?: (value: unknown) => value is T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return validate && !validate(parsed) ? fallback : parsed;
  } catch {
    return fallback;
  }
}

export function writeLocalDraft(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeLocalDraft(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

export function safeFilePart(value: string, fallback = 'download') {
  const cleaned = String(value || fallback)
    .replace(/\.[A-Za-z0-9]{1,8}$/, '')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  return cleaned || fallback;
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 500) {
  let timer: number | undefined;

  return (...args: Parameters<T>) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}
