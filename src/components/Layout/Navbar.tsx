import { Link } from "react-router";
import { SignedIn, useAuth, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header>
      <nav className="flex justify-between items-center">
        <div className="title m-w-60">
          <Link to="/">
            <h1 className="text-4xl cursor-pointer">Recipe Tracker</h1>
          </Link>
        </div>

        <button onClick={toggleMenu} className="md:hidden p-2" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex flex-row gap-4 justify-around items-center">
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
          ) : null}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {isOpen && <div className="fixed inset-0 bg-black bg-opacity-0 z-40 md:hidden" onClick={closeMenu} />}

        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg md:hidden z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}>
          <div className="flex flex-col gap-2 p-4">
            <button onClick={closeMenu} className="self-end p-2 mb-4" aria-label="Close menu">
              <X size={24} />
            </button>
            {isSignedIn ? (
              <>
                <Link to="/recipes" onClick={closeMenu}>
                  <Button className="w-full">All Recipes</Button>
                </Link>
                <Link to="/recipes/saved-recipes" onClick={closeMenu}>
                  <Button className="w-full">Saved Recipes</Button>
                </Link>
                <Link to="/recipes/my-recipes" onClick={closeMenu}>
                  <Button className="w-full">My Recipes</Button>
                </Link>
                <Link to="/recipes/create" onClick={closeMenu}>
                  <Button className="w-full">Create Recipe</Button>
                </Link>
                <div className="pt-2 border-t flex justify-center">
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}
