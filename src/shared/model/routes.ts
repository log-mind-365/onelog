export const AUTH_RESTRICTED_ROUTES: string[] = [];

export const PROTECTED_ROUTES = ["/post/edit", "/profile/edit"];

export const ROUTES = {
  HOME: "/",
  USER: {
    VIEW: (id: string) => `/${id}`,
  },
  ARTICLE: {
    VIEW: (id: string) => `/article/${id}`,
    NEW: "/write",
    EDIT: (id: string) => `/article/${id}/edit`,
  },
  SETTINGS: {
    PROFILE: "/settings/profile",
  },
} as const;
