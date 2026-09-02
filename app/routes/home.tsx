import type { Route } from "./+types/home";
import { Navigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LinkedIn Search" },
    { name: "description", content: "Search professional profiles by skills, titles and location." },
  ];
}

export default function Home() {
  return <Navigate to="/users/search" replace />;
}
