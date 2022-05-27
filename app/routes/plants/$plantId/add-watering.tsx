import type { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { json, redirect } from "@remix-run/node";
import { createWatering } from "~/models/watering.server";
import { Form, useActionData, Link } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Input } from "~/components/Input";
import { Button } from "~/components/Button";

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
    <div className="my-1 w-1/3 rounded border-2 bg-slate-100 p-5 text-center">
      <Form method="post">
        <h3 className="mb-5 text-lg">Enter a watering date:</h3>
        <Input
          name="wateredAt"
          ref={wateredAtRef}
          invalid={actionData?.errors?.wateredAt ? true : undefined}
          error={actionData?.errors?.wateredAt ? "wateredAt-error" : undefined}
          type="date"
        />
        <br />

        <Button text="Add" submit={true} testId="submitWatering" />

        <Link to="../">
          <Button text="Cancel" />
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
