import type { getFeedingListItems } from "~/models/feeding.server";
import type { getWateringListItems } from "~/models/watering.server";
import { PlantItem } from "./PlantItem";

type props = {
  type: string;
  list:
    | Awaited<ReturnType<typeof getWateringListItems>>
    | Awaited<ReturnType<typeof getFeedingListItems>>;
};

export const PlantItemList = ({ type, list }: props) => {
  return (
    <div className="mr-5 rounded px-5 py-2 lg:w-1/3">
      <p>
        <strong>{type}:</strong>{" "}
      </p>
      <ul>
        {list.length
          ? list.map(({ id, date }) => (
              <PlantItem id={id} key={id} date={date} />
            ))
          : `No ${type.toLowerCase()} logged for this plant.`}
      </ul>
    </div>
  );
};
