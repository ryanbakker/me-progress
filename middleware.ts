import { withAuth } from "next-auth/middleware";

export default withAuth;

export const config = {
  matcher: [
    "/create-post",
    "/edit-post/:id",
    "/post/:id/comment",
    "/profile",
    "/edit-profile/:id",
    "/logout",
  ],
};
