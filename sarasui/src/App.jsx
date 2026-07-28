import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import SubjectsPage from "./pages/SubjectsPage";
<<<<<<< HEAD:saraswati-ui/src/App.jsx
import SubjectWorkspacePage from "./pages/SubjectWorkspacePage";
import DocumentPreviewPage from "./pages/DocumentPreviewPage";
import { getSubjectById, getDocumentById } from "./lib/data";
=======
import FavoritesPage from "./pages/FavoritesPage";
import { FavoritesProvider } from "./lib/FavoritesContext";
>>>>>>> edc8217bbd65bb5496f015307cab5d86c1f3ee8c:sarasui/src/App.jsx

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    handle: { crumb: () => "Home" },
    children: [
      { index: true, element: <HomePage /> },
<<<<<<< HEAD:saraswati-ui/src/App.jsx
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
=======
      { path: "subjects", element: <SubjectsPage /> },
      { path: "favorites", element: <FavoritesPage /> },
>>>>>>> edc8217bbd65bb5496f015307cab5d86c1f3ee8c:sarasui/src/App.jsx
    ],
  },
]);

function App() {
  return (
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>
  );
}

export default App;