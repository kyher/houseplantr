import { format, formatDistance } from "date-fns";

type props = {
  id: string;
  date: Date;
};

export const PlantItem = ({ id, date }: props) => {
  return (
    <li key={id}>
      <span className="mr-1">
        {formatDistance(new Date(date), new Date(), {
          addSuffix: true,
        })}
      </span>
      <span>({format(new Date(date), "dd/MM/yyyy")})</span>
    </li>
  );
};
