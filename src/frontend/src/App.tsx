import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";

const DashboardPage = lazy(() => import("./pages/Dashboard"));
const AnalyzePage = lazy(() => import("./pages/Analyze"));
const AnalyzeImagePage = lazy(() => import("./pages/AnalyzeImage"));
const AnalyzeUrlPage = lazy(() => import("./pages/AnalyzeUrl"));
const HistoryPage = lazy(() => import("./pages/History"));
const AboutPage = lazy(() => import("./pages/About"));

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <LoadingSpinner label="Loading…" />
  </div>
);

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <DashboardPage />
    </Suspense>
  ),
});

const analyzeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analyze",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <AnalyzePage />
    </Suspense>
  ),
});

const analyzeImageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analyze/image",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <AnalyzeImagePage />
    </Suspense>
  ),
});

const analyzeUrlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analyze/url",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <AnalyzeUrlPage />
    </Suspense>
  ),
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <HistoryPage />
    </Suspense>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <AboutPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  analyzeRoute,
  analyzeImageRoute,
  analyzeUrlRoute,
  historyRoute,
  aboutRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
