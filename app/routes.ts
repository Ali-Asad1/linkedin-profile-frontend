import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("users/search", "routes/users-search.tsx"),
] satisfies RouteConfig;

