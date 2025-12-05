import { Link } from "react-router";
import { SignedIn, useAuth, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <header>
      <nav className="flex justify-between">
        <div className="title m-w-60">
          <Link to="/">
            <h1 className="text-4xl cursor-pointer">Recipe Tracker</h1>
          </Link>
        </div>
        <div className="links flex flex-row gap-4 justify-around items-center">
          {isSignedIn ? (
            <>
              <Link to="/recipes">
                <Button>All Recipes</Button>
              </Link>
              <Link to="/recipes/saved-recipes">
                <Button>Saved Recipes</Button>
              </Link>
              <Link to="/recipes/my-recipes">
                <Button>My Recipes</Button>
              </Link>
              <Link to="/recipes/create">
                <Button>Create Recipe</Button>
              </Link>
            </>
          ) : (
            <></>
          )}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
