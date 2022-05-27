import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { format } from "date-fns";

import type { Plant } from "~/models/plant.server";
import { deletePlant } from "~/models/plant.server";
import { getPlant } from "~/models/plant.server";
import { getWateringListItems } from "~/models/watering.server";
import { getFeedingListItems } from "~/models/feeding.server";
import { requireUserId } from "~/session.server";
import { PlantItem } from "~/components/PlantItem";
import { Button } from "~/components/Button";
import { PlantItemList } from "~/components/PlantItemList";

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
        {format(new Date(data.plant.purchasedAt), "dd/MM/yyyy")}
      </p>
      <div className="my-2 flex">
        <PlantItemList type="Waterings" list={data.wateringListItems} />
        <PlantItemList type="Feedings" list={data.feedingListItems} />
      </div>

      <hr className="my-4" />
      <div className="flex">
        <Link to={`./add-watering`}>
          <Button text="Add Watering" testId="addWatering" />
        </Link>
        <Link to={`./add-feeding`}>
          <Button text="Add Feeding" testId="addFeeding" />
        </Link>
        <Form method="post">
          <Button text="Delete" submit={true} />
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
