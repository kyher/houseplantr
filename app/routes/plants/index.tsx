import { Link } from "@remix-run/react";

export default function PlantIndexPage() {
  return (
    <p>
      No plant selected. Select a plant on the left, or{" "}
      <Link to="new" className="text-green-500 underline">
        create a new plant.
      </Link>
    </p>
  );
}
