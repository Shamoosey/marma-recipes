import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { ToastContainer } from "react-toastify";
import { Layout } from "@/components/Layout/Layout";
import { Recipes } from "@/pages/Recipe/AllRecipes";
import { Landing } from "@/pages/Landing";
import { NotFound } from "@/pages/NotFound";
import { MyRecipes } from "@/pages/Recipe/MyRecipes";
import { CreateRecipe } from "@/pages/Recipe/CreateRecipe";
import { UpdateRecipe } from "@/pages/Recipe/UpdateRecipe";
import { ViewRecipe } from "@/pages/Recipe/ViewRecipe";
import { SavedRecipes } from "@/pages/Recipe/SavedRecipes";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />

          <Route path="recipes">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="saved-recipes"
              element={
                <ProtectedRoute>
                  <SavedRecipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-recipes"
              element={
                <ProtectedRoute>
                  <MyRecipes />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute>
                  <ViewRecipe />
                </ProtectedRoute>
              }
            />
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
