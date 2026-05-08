import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import { Layout } from "@/components/Layout/Layout";
import { Recipes } from "@/pages/Recipe/AllRecipes";
import { NotFound } from "@/pages/NotFound";
import { UserRecipes } from "@/pages/Recipe/UserRecipes";
import { CreateRecipe } from "@/pages/Recipe/CreateRecipe";
import { UpdateRecipe } from "@/pages/Recipe/UpdateRecipe";
import { ViewRecipe } from "@/pages/Recipe/ViewRecipe";
import { SavedRecipes } from "@/pages/Recipe/SavedRecipes";
import { AdminPannel } from "@/pages/AdminPannel";
import { AdminRoute, ProtectedRoute } from "@/components/util/RouteHelpers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Recipes />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminPannel />
              </AdminRoute>
            }
          />
          <Route path="recipes">
            <Route index element={<Recipes />} />
            <Route
              path="saved-recipes"
              element={
                <ProtectedRoute>
                  <SavedRecipes />
                </ProtectedRoute>
              }
            />
            <Route path="user-recipes/:id" element={<UserRecipes />} />
            <Route path=":id" element={<ViewRecipe />} />
            <Route
              path=":id/edit"
              element={
                <ProtectedRoute>
                  <UpdateRecipe />
                </ProtectedRoute>
              }
            />
            <Route
              path="create"
              element={
                <ProtectedRoute>
                  <CreateRecipe />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
