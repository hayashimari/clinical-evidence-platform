import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { SearchResults } from "./pages/SearchResults";
import { ResourceDetail } from "./pages/ResourceDetail";
import { LearningQuiz } from "./pages/LearningQuiz";
import { ResearchSupport } from "./pages/ResearchSupport";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "search", Component: SearchResults },
      { path: "resource/:id", Component: ResourceDetail },
      { path: "learning", Component: LearningQuiz },
      { path: "research", Component: ResearchSupport },
    ],
  },
]);
