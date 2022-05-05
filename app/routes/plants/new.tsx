import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createPlant } from "~/models/plant.server";
import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {
    name?: string;
    location?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const location = formData.get("location");

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

  const plant = await createPlant({ name, location, userId });

  return redirect(`/plants/${plant.id}`);
};

export default function NewPlantPage() {
  const actionData = useActionData() as ActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);
  const locationRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.location) {
      locationRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            ref={nameRef}
            name="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "name-error" : undefined
            }
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
          <input
            ref={locationRef}
            name="location"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.location ? true : undefined}
            aria-errormessage={
              actionData?.errors?.location ? "location-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.location && (
          <div className="pt-1 text-red-700" id="location-error">
            {actionData.errors.location}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
