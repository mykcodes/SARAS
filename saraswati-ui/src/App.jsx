import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectWorkspacePage from "./pages/SubjectWorkspacePage";
import DocumentPreviewPage from "./pages/DocumentPreviewPage";
import { getSubjectById, getDocumentById } from "./lib/data";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;