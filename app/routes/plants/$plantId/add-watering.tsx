import type { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { json, redirect } from "@remix-run/node";
import { createWatering } from "~/models/watering.server";
import { Form, useActionData, Link } from "@remix-run/react";
import { useEffect, useRef } from "react";

type ActionData = {
  errors?: {
    wateredAt?: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.plantId, "plantId not found");
  let wateredDate;
  const formData = await request.formData();
  const wateredAtFormData = formData.get("wateredAt");

  if (typeof wateredAtFormData !== "string" || wateredAtFormData.length === 0) {
    return json<ActionData>(
      { errors: { wateredAt: "Watered at is required" } },
      { status: 400 }
    );
  } else {
    wateredDate = new Date(wateredAtFormData);
  }

  await createWatering({ wateredDate, plantId: params.plantId });

  return redirect(`/plants/${params.plantId}`);
};

export default function AddWateringPage() {
  const actionData = useActionData() as ActionData;
  const wateredAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.wateredAt) {
      wateredAtRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="my-1 w-1/3 rounded bg-blue-900 p-5 text-center text-white">
      <Form method="post">
        <h3 className="mb-5 text-lg">Enter a watering date:</h3>
        <input
          ref={wateredAtRef}
          data-testid="wateredAt"
          type="date"
          name="wateredAt"
          className="mb-5 flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose text-black"
          aria-invalid={actionData?.errors?.wateredAt ? true : undefined}
          aria-errormessage={
            actionData?.errors?.wateredAt ? "wateredAt-error" : undefined
          }
        />
        <br />

        <button
          type="submit"
          data-testid="submitWatering"
          className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800"
        >
          Add
        </button>
        <Link to="../">
          <button className="inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800">
            Cancel
          </button>
        </Link>
      </Form>
      {actionData?.errors?.wateredAt && (
        <div className="pt-1 text-red-700" id="name-error">
          {actionData.errors.wateredAt}
        </div>
      )}
    </div>
  );
}
