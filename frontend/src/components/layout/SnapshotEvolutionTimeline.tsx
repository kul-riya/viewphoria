import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { FaCircle } from "react-icons/fa";
import { useState } from "react";
const events = [
  {
    date: "2025-01-01",
    title: "New Year Celebration",
    description: "Welcoming the new year with joy and happiness.",
  },
  {
    date: "2025-03-20",
    title: "Spring Equinox",
    description: "The start of spring with blooming flowers everywhere.",
  },
  {
    date: "2025-06-21",
    title: "Summer Solstice",
    description: "Longest day of the year with plenty of sunshine.",
  },
  {
    date: "2025-09-23",
    title: "Autumn Equinox",
    description: "Leaves changing color and a crisp autumn breeze.",
  },
  {
    date: "2025-12-21",
    title: "Winter Solstice",
    description: "Shortest day of the year, cozy nights and warm drinks.",
  },
  {
    date: "2025-12-21",
    title: "Winter Solstice",
    description: "Shortest day of the year, cozy nights and warm drinks.",
  },
  {
    date: "2025-12-21",
    title: "Winter Solstice",
    description: "Shortest day of the year, cozy nights and warm drinks.",
  },
  {
    date: "2025-12-21",
    title: "Winter Solstice",
    description: "Shortest day of the year, cozy nights and warm drinks.",
  },
  {
    date: "2025-12-21",
    title: "Winter Solstice",
    description: "Shortest day of the year, cozy nights and warm drinks.",
  },
  {
    date: "2025-12-21",
    title: "Winter Solstice",
    description: "Shortest day of the year, cozy nights and warm drinks.",
  },
];

const SnapshotEvolutionTimeline = () => {
  return (
    <div className="px-20 h-fit">
      <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-center">
        Event Timeline
      </h1>

      {/* Mobile/vertical version */}
      <div className="w-full md:hidden">
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-7.5 top-0 bottom-0 w-1 bg-gray-300"></div>

          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative mb-8 last:mb-0"
            >
              {/* Dot */}
              <div className="absolute left-0 top-1/2 w-8 h-8 -ml-4 -translate-y-1/2 bg-purple-500 rounded-full flex items-center justify-center shadow-lg z-10">
                <FaCircle className="text-white text-xs" />
              </div>

              {/* Card */}
              <div className="ml-8">
                <Card className="w-full shadow-lg bg-white">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.date}</p>
                    <p className="mt-2 text-gray-700 text-sm">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Horizontal for larger screens */}
      <div className="w-full overflow-x-auto overflow-y-visible h-124 hidden md:block">
        <div className="relative min-w-max hidden md:block h-fit">
          {/* Horizontal line should extend over all events */}
          <div className="absolute left-0 right-0 bottom-5 h-1 bg-gray-300 -translate-y-1/2 w-full "></div>

          <div className="h-fit flex justify-between w-max">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center relative p-2"
              >
                {/* Card - positioned above/below the line */}
                <div
                  className={`relative ${
                    index % 2 === 0 ? "bottom-2" : "top-62"
                  }`}
                >
                  <Card className="shadow-lg bg-white w-60 ">
                    <CardContent className="h-40">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-gray-600 text-sm">{event.date}</p>
                      <p className="mt-2 text-gray-700 text-sm">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Dot - on the line */}
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg z-10">
                  <FaCircle className="text-white text-xs" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapshotEvolutionTimeline;
