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

export const ADMIN_RESERVED_NICKNAMES = ["admin", "administrator", "관리자"] as const;

export function isAdminNickname(nickname: string): boolean {
  const normalized = String(nickname || "").trim();
  return ADMIN_RESERVED_NICKNAMES.some((n) => {
    if (n === "관리자") return normalized === "관리자";
    return normalized.toLowerCase() === n.toLowerCase();
  });
}

export function checkAdminAuth(
  nickname: string,
  password: string
): { isAdmin: boolean; error?: string } {
  if (!isAdminNickname(nickname)) {
    return { isAdmin: false };
  }
  const adminPassword = process.env.ADMIN_POST_PASSWORD;
  if (!adminPassword) {
    return { isAdmin: false, error: "이 닉네임은 사용할 수 없습니다." };
  }
  if (password === adminPassword) {
    return { isAdmin: true };
  }
  return { isAdmin: false, error: "이 닉네임은 사용할 수 없습니다." };
}

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin123";
export const SESSION_COOKIE = "hustler_admin_session";
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
