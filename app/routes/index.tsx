import { Link } from "@remix-run/react";
import { Button } from "~/components/Button";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative grid min-h-screen grid-cols-1 items-center bg-white text-center">
      <div>
        <h1 className="text-3xl">Houseplantr</h1>
        <h2 className="text-2xl italic">
          A houseplant tracker by{" "}
          <a href="https://www.github.com/kyher">@kyher</a>
        </h2>
      </div>
      <div>
        {user ? (
          <Link to="/plants">
            <Button
              text={`View Plants for 
          ${user.email}`}
            />
          </Link>
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            <Link to="/join">
              <Button text="Sign up" />
            </Link>
            <Link to="/login">
              <Button text="Log In" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
