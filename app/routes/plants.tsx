import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getPlantListItems } from "~/models/plant.server";
import { Button } from "~/components/Button";

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

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-green-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Plants</Link>
        </h1>
        <Form action="/logout" method="post">
          <Button text="Logout" submit={true} />
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
                    <br />
                    <span className="ml-7 text-xs italic text-slate-400">
                      {plant.location}
                    </span>
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
