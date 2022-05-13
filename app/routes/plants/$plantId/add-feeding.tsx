import type { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { json, redirect } from "@remix-run/node";
import { createFeeding } from "~/models/feeding.server";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { Link } from "react-router-dom";

type ActionData = {
  errors?: {
    fedAt?: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.plantId, "plantId not found");
  let fedDate;
  const formData = await request.formData();
  const fedAtFormData = formData.get("fedAt");

  if (typeof fedAtFormData !== "string" || fedAtFormData.length === 0) {
    return json<ActionData>(
      { errors: { fedAt: "Fed at is required" } },
      { status: 400 }
    );
  } else {
    fedDate = new Date(fedAtFormData);
  }

  await createFeeding({ fedDate, plantId: params.plantId });

  return redirect(`/plants/${params.plantId}`);
};

export default function AddFeedingPage() {
  const actionData = useActionData() as ActionData;
  const fedAtRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.fedAt) {
      fedAtRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="my-1 w-1/3 rounded bg-green-900 p-5 text-center text-white">
      <Form method="post">
        <h3 className="mb-5 text-lg">Enter a feeding date:</h3>
        <input
          ref={fedAtRef}
          data-testid="fedAt"
          type="date"
          name="fedAt"
          className="mb-5 flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose text-black"
          aria-invalid={actionData?.errors?.fedAt ? true : undefined}
          aria-errormessage={
            actionData?.errors?.fedAt ? "fedAt-error" : undefined
          }
        />
        <br />

        <button
          type="submit"
          data-testid="submitFeeding"
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
      {actionData?.errors?.fedAt && (
        <div className="pt-1 text-red-700" id="name-error">
          {actionData.errors.fedAt}
        </div>
      )}
    </div>
  );
}
