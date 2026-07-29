import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import HomePage from "./pages/HomePage";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectWorkspacePage from "./pages/SubjectWorkspacePage";
import DocumentPreviewPage from "./pages/DocumentPreviewPage";
import Skeleton from "./components/shared/Skeleton";
import { getSubjectById, getDocumentById } from "./lib/data";

const RecentPage = lazy(() => import("./pages/RecentPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const TrashPage = lazy(() => import("./pages/TrashPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function LazyFallback() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-8 py-6">
      <Skeleton className="h-8 w-48" style={{ borderRadius: 8 }} />
      <Skeleton.Grid count={4} />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    handle: { crumb: () => "Home" },
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "subjects",
        element: <Outlet />,
        handle: { crumb: () => "Subjects" },
        children: [
          { index: true, element: <SubjectsPage /> },
          {
            path: ":subjectId",
            element: <Outlet />,
            handle: {
              crumb: (match) => getSubjectById(match.params.subjectId)?.title ?? "Subject",
            },
            children: [
              { index: true, element: <SubjectWorkspacePage /> },
              {
                path: "documents/:documentId",
                element: <DocumentPreviewPage />,
                handle: {
                  crumb: (match) => {
                    const doc = getDocumentById(match.params.subjectId, match.params.documentId);
                    return doc?.title ?? "Document";
                  },
                },
              },
            ],
          },
        ],
      },
      {
        path: "recent",
        element: (
          <Suspense fallback={<LazyFallback />}>
            <RecentPage />
          </Suspense>
        ),
        handle: { crumb: () => "Recent" },
      },
      {
        path: "favorites",
        element: (
          <Suspense fallback={<LazyFallback />}>
            <FavoritesPage />
          </Suspense>
        ),
        handle: { crumb: () => "Favorites" },
      },
      {
        path: "trash",
        element: (
          <Suspense fallback={<LazyFallback />}>
            <TrashPage />
          </Suspense>
        ),
        handle: { crumb: () => "Trash" },
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<LazyFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;