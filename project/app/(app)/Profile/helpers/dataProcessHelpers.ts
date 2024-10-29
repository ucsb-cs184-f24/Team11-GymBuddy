type WorkoutData = { day_of_week: number; total: number };
type BodyData = { body_area: string; total: number };

type DataInput = WorkoutData | BodyData;

export const processWeeklyData = (
  data: DataInput[],
  category: "Workouts" | "Body"
) => {
  if (category === "Workouts") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let barData = days.map(
      (label) =>
        ({
          label,
          value: 0,
          frontColor: "#d1d5db",
          gradientColor: "#d1d5db",
        } as any)
    );

    (data as WorkoutData[]).forEach((item) => {
      const dayIndex = item.day_of_week;
      if (dayIndex >= 0 && dayIndex < 7) {
        barData[dayIndex].value = item.total;

        if (item.total < 1) {
          barData[dayIndex].frontColor = "#d1d5db";
          barData[dayIndex].gradientColor = "#d1d5db";
        } else {
          barData[dayIndex].frontColor = "#ffab00";
          barData[dayIndex].gradientColor = "#ff0000";
        }
      }
    });

    const currentDayIndex = new Date().getDay();
    barData = [
      ...barData.slice(currentDayIndex + 1),
      ...barData.slice(0, currentDayIndex + 1),
    ];

    return barData;
  } else if (category === "Body") {
    const bodyAreas = ["Chest", "Shoulders", "Arms", "Back", "Core", "Legs"];

    let barData = bodyAreas.map((label) => ({
      label,
      value: 0,
      frontColor: "#d1d5db",
      gradientColor: "#d1d5db",
    }));

    (data as BodyData[]).forEach((item) => {
      const bodyAreaIndex = bodyAreas.indexOf(item.body_area);
      if (bodyAreaIndex >= 0) {
        barData[bodyAreaIndex].value = item.total;

        if (item.total < 1) {
          barData[bodyAreaIndex].frontColor = "#d1d5db";
          barData[bodyAreaIndex].gradientColor = "#d1d5db";
        } else {
          barData[bodyAreaIndex].frontColor = "#ffab00";
          barData[bodyAreaIndex].gradientColor = "#ff0000";
        }
      }
    });

    return barData;
  }
  return [];
};

export const parseDateTime = (date: string, time: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const zeroIndexedMonth = month - 1;
  return { year, zeroIndexedMonth, day, hour, minute };
};
