export const AUTH_RESTRICTED_ROUTES: string[] = []; // 미사용

export const PROTECTED_ROUTES = ["/post/edit", "/profile/edit"]; // 미사용

export const ROUTES = {
  HOME: "/",
  AUTH: {
    SIGN_IN: "/sign_in",
    SIGN_UP: "/sign_up",
  },
  PROFILE: {
    VIEW: (id: string) => `/${id}`,
  },
  ARTICLE: {
    VIEW: (id: string) => `/article/${id}`,
    NEW: "/write",
    EDIT: (id: string) => `/article/${id}/edit`,
  },
  SETTINGS: {
    PROFILE: "/settings/profile",
    DISPLAY: "/settings/display",
  },
} as const;
