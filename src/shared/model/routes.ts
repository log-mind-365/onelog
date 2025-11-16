export const ROUTES = {
  HOME: "/",
  AUTH: {
    SIGN_IN: "/sign_in",
    SIGN_UP: "/sign_up",
  },
  PROFILE: {
    VIEW: (profileId: string) => `/profile/${profileId}`,
  },
  ARTICLE: {
    VIEW: (articleId: number) => `/article/${articleId}`,
    NEW: "/write",
    EDIT: (id: number) => `/article/${id}/edit`,
  },
  SETTINGS: {
    PROFILE: "/settings/profile",
    DISPLAY: "/settings/display",
  },
} as const;

export const AUTH_RESTRICTED_ROUTES: string[] = [
  ROUTES.AUTH.SIGN_IN,
  ROUTES.AUTH.SIGN_UP,
];

export const PROTECTED_ROUTES = [ROUTES.ARTICLE.NEW, ROUTES.SETTINGS.PROFILE];
