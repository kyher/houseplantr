import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getPlantListItems } from "~/models/plant.server";

type LoaderData = {
  plantListItems: Awaited<ReturnType<typeof getPlantListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const plantListItems = await getPlantListItems({ userId });
  return json<LoaderData>({ plantListItems });
};

export default function PlantsPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-green-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Plants</Link>
        </h1>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-green-600 py-2 px-4 text-blue-100 hover:bg-green-500 active:bg-green-400"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-1/3 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-green-500">
            + New plant
          </Link>

          <hr />

          {data.plantListItems.length === 0 ? (
            <p className="p-4">No plants yet</p>
          ) : (
            <ol>
              {data.plantListItems.map((plant) => (
                <li key={plant.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={plant.id}
                  >
                    🪴{plant.name}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
