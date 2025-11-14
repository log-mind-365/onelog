export const ROUTES = {
  HOME: "/",
  AUTH: {
    SIGN_IN: "/sign_in",
    SIGN_UP: "/sign_up",
  },
  PROFILE: {
    VIEW: (profileId: string) => `/${profileId}`,
  },
  ARTICLE: {
    VIEW: (articleId: number) => `/article/${articleId}`,
    NEW: "/write",
    EDIT: (articleId: number) => `/article/${articleId}/edit`,
  },
  SETTINGS: {
    PROFILE: "/settings/profile",
    DISPLAY: "/settings/display",
  },
} as const;
