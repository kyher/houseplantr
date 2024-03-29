import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";

import { createPlant } from "~/models/plant.server";
import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {
    name?: string;
    location?: string;
    purchasedAt?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const location = formData.get("location");
  const purchasedAtFormData = formData.get("purchasedAt");
  let purchasedAt;

  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  if (typeof location !== "string" || location.length === 0) {
    return json<ActionData>(
      { errors: { location: "Location is required" } },
      { status: 400 }
    );
  }

  if (
    typeof purchasedAtFormData !== "string" ||
    purchasedAtFormData.length === 0
  ) {
    return json<ActionData>(
      { errors: { purchasedAt: "Purchased at is required" } },
      { status: 400 }
    );
  } else {
    purchasedAt = new Date(purchasedAtFormData);
  }

  const plant = await createPlant({ name, location, purchasedAt, userId });

  return redirect(`/plants/${plant.id}`);
};

export default function NewPlantPage() {
  const actionData = useActionData() as ActionData;
  const nameRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const purchasedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.location) {
      locationRef.current?.focus();
    } else if (actionData?.errors?.purchasedAt) {
      purchasedAtRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post">
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <Input
            name="name"
            ref={nameRef}
            invalid={actionData?.errors?.name ? true : undefined}
            error={actionData?.errors?.name ? "name-error" : undefined}
          />
        </label>
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData.errors.name}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Location: </span>
          <Input
            name="location"
            ref={locationRef}
            invalid={actionData?.errors?.location ? true : undefined}
            error={actionData?.errors?.location ? "location-error" : undefined}
          />
        </label>
        {actionData?.errors?.location && (
          <div className="pt-1 text-red-700" id="location-error">
            {actionData.errors.location}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Purchased At: </span>
          <Input
            name="purchasedAt"
            ref={purchasedAtRef}
            invalid={actionData?.errors?.purchasedAt ? true : undefined}
            error={
              actionData?.errors?.purchasedAt ? "purchasedAt-error" : undefined
            }
            type="date"
          />
        </label>
        {actionData?.errors?.purchasedAt && (
          <div className="pt-1 text-red-700" id="purchasedAt-error">
            {actionData.errors.purchasedAt}
          </div>
        )}
      </div>
      <div className="text-right">
        <Button text="Save" submit={true} />
      </div>
    </Form>
  );
}
