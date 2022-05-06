import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white grid grid-cols-1 items-center text-center">
      <div>
        <h1 className="text-3xl">Houseplantr</h1>
        <h2 className="text-2xl italic">A houseplant tracker by <a href="https://www.github.com/kyher">@kyher</a></h2>
      </div>
      <div>
      {user ? (
        <Link
          to="/plants"
          className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-green-700 shadow-sm hover:bg-yellow-50 sm:px-8"
        >
          View Plants for {user.email}
        </Link>
      ) : (
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
          <Link
            to="/join"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-green-700 shadow-sm hover:bg-yellow-50 sm:px-8"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center rounded-md bg-green-500 px-4 py-3 font-medium text-white hover:bg-green-600  "
          >
            Log In
          </Link>
        </div>
      )}
      </div>
    </main>
  );
}
