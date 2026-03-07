export function sanitize(input: string): string {
  return String(input)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export function isNumericPassword(password: string): boolean {
  return /^\d+$/.test(password);
}

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin123";
export const SESSION_COOKIE = "hustler_admin_session";
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
