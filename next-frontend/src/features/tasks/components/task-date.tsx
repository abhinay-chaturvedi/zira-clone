import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";

interface TaskDateProps {
  value: string;
  className?: string;
}
export const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffIndays = differenceInDays(endDate, today);
  console.log("diffInDays", diffIndays)
  let textColor = "text-muted-foreground";
  if (diffIndays <= 3) {
    textColor = "text-red-500";
  } else if (diffIndays <= 7) {
    textColor = "text-orange-500";
  } else if (diffIndays <= 14) {
    textColor = "text-yellow-500";
  }
  return (
    <div className={textColor}>
      <span className={cn("truncate ", className)}>{format(value, "PPP")}</span>
    </div>
  );
};
