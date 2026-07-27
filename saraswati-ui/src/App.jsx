import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import SubjectsPage from "./pages/SubjectsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "subjects", element: <SubjectsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;