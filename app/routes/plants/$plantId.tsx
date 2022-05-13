import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Plant } from "~/models/plant.server";
import { deletePlant } from "~/models/plant.server";
import { getPlant } from "~/models/plant.server";
import { getWateringListItems } from "~/models/watering.server";
import { getFeedingListItems } from "~/models/feeding.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  plant: Plant;
  wateringListItems: Awaited<ReturnType<typeof getWateringListItems>>;
  feedingListItems: Awaited<ReturnType<typeof getFeedingListItems>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.plantId, "plantId not found");

  const plant = await getPlant({ userId, id: params.plantId });
  if (!plant) {
    throw new Response("Not Found", { status: 404 });
  }

  const wateringListItems = await getWateringListItems({
    plantId: params.plantId,
  });

  const feedingListItems = await getFeedingListItems({
    plantId: params.plantId,
  });

  return json<LoaderData>({ plant, wateringListItems, feedingListItems });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.plantId, "plantId not found");

  await deletePlant({ userId, id: params.plantId });

  return redirect("/plants");
};

export default function PlantDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.plant.name}</h3>
      <p>
        <strong>Location:</strong> {data.plant.location}
      </p>
      <p>
        <strong>Purchased At:</strong>{" "}
        {new Date(data.plant.purchasedAt).toLocaleDateString("en-GB")}
      </p>
      <div className="flex my-2">
        <div className="rounded bg-blue-900 px-5 py-2 text-white lg:w-1/5 mr-5">
          <p>
            <strong>💦 Waterings:</strong>{" "}
          </p>
          <ul>
            {data.wateringListItems.length
              ? data.wateringListItems.map((watering) => (
                  <li key={watering.id}>
                    {new Date(watering.wateredDate).toLocaleDateString("en-GB")}
                  </li>
                ))
              : "No waterings logged for this plant."}
          </ul>
        </div>
        <div className="rounded bg-green-900 px-5 py-2 text-white lg:w-1/5">
          <p>
            <strong>💩 Feedings:</strong>{" "}
          </p>
          <ul>
            {data.feedingListItems.length
              ? data.feedingListItems.map((feeding) => (
                  <li key={feeding.id}>
                    {new Date(feeding.fedDate).toLocaleDateString("en-GB")}
                  </li>
                ))
              : "No feedings logged for this plant."}
          </ul>
        </div>
      </div>
    
      <hr className="my-4" />
      <div className="flex">
        <Link to={`./add-watering`}>
          <button
            className="mr-2 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            data-testid="addWatering"
          >
            Add Watering
          </button>
        </Link>
        <Link to={`./add-feeding`}>
          <button
            className="mr-2 rounded bg-green-500 py-2 px-4 text-white hover:bg-green-600 focus:bg-green-400"
            data-testid="addFeeding"
          >
            Add Feeding
          </button>
        </Link>
        <Form method="post">
          <button
            type="submit"
            className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
          >
            Delete
          </button>
        </Form>
      </div>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Plant not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
