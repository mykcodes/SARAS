import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import SubjectsPage from "./pages/SubjectsPage";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoritesProvider } from "./lib/FavoritesContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "subjects", element: <SubjectsPage /> },
      { path: "favorites", element: <FavoritesPage /> },
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