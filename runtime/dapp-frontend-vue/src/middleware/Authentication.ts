import Cookies from "js-cookie";

export const authenticationHandler = (to: any, from: any, next: any) => {
  const isAuthenticated = Cookies.get("accessToken");
  if (to?.meta?.protected && !isAuthenticated) {
    next({
      path: "/onboarding",
    });
  }

  next();
};
