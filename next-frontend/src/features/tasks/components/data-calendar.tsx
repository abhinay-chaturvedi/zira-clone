import React, { useState } from "react";
import { enUS } from "date-fns/locale";
import { Task } from "../types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./data-calender.css"
import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import EventCard from "./event-card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface DataCalendarProps {
  data: Task[];
}
interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: "NEXT" | "PREV" | "TODAY") => void
}
const locales = {
  "en-us": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const CustomToolbar = ({date, onNavigate}: CustomToolbarProps) => {
      return (
        <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
          <Button onClick={() => onNavigate("PREV")} variant={"secondary"} className="flex items-center">
            <ChevronLeftIcon className="size-4"/>
          </Button>
          <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
            <CalendarIcon className="size-4 mr-2"/>
            <p className="text-sm">{format(date, "MMMM yyyy")}</p>
          </div>
          <Button onClick={() => onNavigate("NEXT")} variant={"secondary"} >
            <ChevronRightIcon className="size-4"/>
          </Button>
        </div>
      )
}
const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );
  const events = data.map((task) => {
    return {
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      title: task.name,
      project: task.project,
      assignee: task.assignee,
      status: task.status,
      id: task.$id,
    };
  });
  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };
  return (
    <div>
      <Calendar
        localizer={localizer}
        date={value}
        events={events}
        views={["month"]}
        defaultView="month"
        toolbar
        showAllEvents
        className="h-full"
        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        formats={{
          weekdayFormat: (date, culture, localizer) => localizer?.format(date, "EEE", culture)?? ""
        }}
        components={{
          eventWrapper: ({ event }) => {
            return (
              <EventCard
                id={event.id}
                title={event.title}
                assignee={event.assignee}
                project={event.project}
                status={event.status}
              />
            )
          },
          toolbar: () => (
            <CustomToolbar date={value} onNavigate={handleNavigate}/>
          )
        }}
      />
    </div>
  );
};

export default DataCalendar;
