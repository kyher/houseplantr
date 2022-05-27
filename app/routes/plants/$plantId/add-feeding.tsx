import type { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { json, redirect } from "@remix-run/node";
import { createFeeding } from "~/models/feeding.server";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Input } from "~/components/Input";
import { Button } from "~/components/Button";

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
  const fedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.fedAt) {
      fedAtRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="my-1 w-1/3 rounded bg-green-900 p-5 text-center text-white">
      <Form method="post">
        <h3 className="mb-5 text-lg">Enter a feeding date:</h3>
        <Input
          name="fedAt"
          ref={fedAtRef}
          invalid={actionData?.errors?.fedAt ? true : undefined}
          error={actionData?.errors?.fedAt ? "fedAt-error" : undefined}
        />

        <br />
        <Button text="Add" submit={true} testId="submitFeeding" />

        <Link to="../">
          <Button text="Cancel" />
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
