"use client";
import React, { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion } from "framer-motion";
import gsap from "gsap";

interface ClassSchedule {
  _id: string;
  className: string;
  section: string;
  subject: string;
  teacherName?: string;
  teacher?: string;
  day: string[];
  startTime: string;
  endTime: string;
  description?: string;
}

interface CalendarProps {
  classSchedules: ClassSchedule[];
  className: string;
  section: string;
}

const dayToNumber: Record<string, number> = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6,
};

function getNextDateForDay(day: string) {
  const today = new Date();
  const todayNum = today.getDay();
  const targetNum = dayToNumber[day];
  let diff = targetNum - todayNum;
  if (diff < 0) diff += 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + diff);
  return nextDate;
}

export default function ClassesCalendar({ classSchedules, className, section }: CalendarProps) {
  const calendarRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [calendarHeight, setCalendarHeight] = useState(600);
  const [aspectRatio, setAspectRatio] = useState(1.35);

  // Guard: ensure classSchedules is always an array
  const safeSchedules = Array.isArray(classSchedules) ? classSchedules : [];

  // Filter schedules for the selected class and section
  const filtered = safeSchedules.filter(
    (c) => c.className === className && c.section === section
  );

  // Map to FullCalendar events
  const events = filtered.flatMap((c) =>
    Array.isArray(c.day) ? c.day.map((day) => {
      // Compute next date for the day
      const nextDate = getNextDateForDay(day);
      // Set start and end times
      const [startHour, startMinute] = c.startTime.split(":");
      const [endHour, endMinute] = c.endTime.split(":");
      const start = new Date(nextDate);
      start.setHours(Number(startHour), Number(startMinute), 0, 0);
      const end = new Date(nextDate);
      end.setHours(Number(endHour), Number(endMinute), 0, 0);
      return {
        id: c._id + day,
        title: `${c.subject} (${c.teacherName || c.teacher})`,
        start,
        end,
        description: c.description,
      };
    }) : []
  );

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: "elastic.out(1, 0.5)" }
      );
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 400) {
        setCalendarHeight(400);
        setAspectRatio(0.6);
      } else if (window.innerWidth < 640) {
        setCalendarHeight(500);
        setAspectRatio(0.8);
      } else if (window.innerWidth < 1024) {
        setCalendarHeight(600);
        setAspectRatio(1.1);
      } else {
        setCalendarHeight(650);
        setAspectRatio(1.35);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-2 sm:p-4 md:p-8 mt-8 border border-blue-200"
      style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
    >
      <h2
        ref={titleRef}
        className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent mb-4 text-center tracking-wide drop-shadow-lg"
      >
        Calendar for Class {className} - Section {section}
      </h2>
      <div className="overflow-x-auto rounded-2xl">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={calendarHeight}
          aspectRatio={aspectRatio}
          events={events}
          eventContent={renderEventContent}
          nowIndicator={true}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          editable={false}
          selectable={false}
          eventDisplay="block"
          dayMaxEvents={true}
        />
      </div>
    </motion.div>
  );
}

function renderEventContent(eventInfo: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 4px 16px 0 rgba(59,130,246,0.15)" }}
      className="rounded-xl px-1.5 py-1 bg-gradient-to-r from-blue-100 via-cyan-100 to-green-100 border border-blue-200 shadow text-blue-900 font-semibold text-[10px] xs:text-xs sm:text-sm md:text-base whitespace-pre-line break-words max-w-full"
      style={{ minWidth: 0 }}
    >
      <div className="truncate font-bold text-blue-800 text-[10px] xs:text-xs sm:text-sm md:text-base max-w-full">
        {eventInfo.event.title}
      </div>
      <div className="text-[9px] xs:text-[10px] sm:text-xs text-blue-500 max-w-full">
        {eventInfo.timeText}
      </div>
      {eventInfo.event.extendedProps.description && (
        <div className="text-[9px] xs:text-[10px] sm:text-xs text-blue-400 mt-1 truncate max-w-full">
          {eventInfo.event.extendedProps.description}
        </div>
      )}
    </motion.div>
  );
} 