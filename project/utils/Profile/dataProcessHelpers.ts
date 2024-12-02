import { workoutsByCategory } from "@/utils/Workout/workoutCatagory";

export enum Period {
  Week = "Week",
  Month = "Month",
  Year = "Year",
}

export enum ChartCategory {
  Workouts = "Workouts",
  Body = "Body",
}

interface BodyAreas {
  [bodyArea: string]: number;
}

interface WorkoutSummary {
  totalWorkout: number;
  bodyAreas: BodyAreas;
}

export interface WorkoutDayResults {
  [date: string]: WorkoutSummary;
}

export const getRangeForPeriod = (period: Period, date: Date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  if (period === Period.Week) {
    // Sets start date to 6 days ago (to cover last 7 days)
    // Example: (Thu - Wed)
    startDate.setDate(startDate.getDate() - 6);
  } else if (period === Period.Month) {
    // Sets start date to beginning of month
    // Example: (Oct 1 - Oct 31), (Oct 1 - Oct 20)
    startDate.setDate(1);
  } else if (period === Period.Year) {
    // Sets start date to 11 months ago (to cover last 12 months)
    startDate.setMonth(startDate.getMonth() - 11);
    // Sets start date to beginning of month to cover whole month
    startDate.setDate(1);

    // Sets end date to end of month to cover whole month
    // Example (Dec 1, 2023 - Jan 31, 2024)
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
  }

  return {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
  };
};

const processBodyData = (data: WorkoutDayResults) => {
  const labels = Object.keys(workoutsByCategory);

  let barData = labels.map((label) => ({
    label,
    value: 0,
    frontColor: "#d1d5db",
    gradientColor: "#d1d5db",
  }));

  Object.entries(data).forEach(([_, summary]) => {
    Object.entries(summary.bodyAreas).forEach(([bodyArea, count]) => {
      const indexOfBodyArea = barData.findIndex(
        (bar) => bar.label === bodyArea
      );
      barData[indexOfBodyArea].value += count;
    });
  });

  barData = barData.map((item) => ({
    ...item,
    frontColor: item.value >= 1 ? "#ffab00" : "#d1d5db",
    gradientColor: item.value >= 1 ? "#ff0000" : "#d1d5db",
  }));

  return barData;
};

const processWeeklyWorkoutData = (
  data: WorkoutDayResults,
  currentDate: Date
) => {
  let labels: string[] = [];
  const { startDate, endDate } = getRangeForPeriod(Period.Week, currentDate);
  const tempStartDate = new Date(startDate);
  const tempEndDate = new Date(endDate);

  while (tempStartDate <= tempEndDate) {
    labels.push(tempStartDate.toLocaleDateString());
    tempStartDate.setDate(tempStartDate.getDate() + 1);
  }

  let barData = labels.map((label) => ({
    label,
    value: 0,
    frontColor: "#d1d5db",
    gradientColor: "#d1d5db",
  }));

  Object.entries(data).forEach(([date, summary]) => {
    const indexOfDate = barData.findIndex((bar) => bar.label === date);
    const isActive = summary.totalWorkout >= 1;
    barData[indexOfDate].value = summary.totalWorkout;
    barData[indexOfDate].frontColor = isActive ? "#ffab00" : "#d1d5db";
    barData[indexOfDate].gradientColor = isActive ? "#ff0000" : "#d1d5db";
  });

  barData = barData.map((item) => {
    const { year, zeroIndexedMonth, day } = parseDateString(item.label);
    const dayString = new Date(year, zeroIndexedMonth, day).toLocaleDateString(
      "en-US",
      { weekday: "short" }
    );
    return {
      ...item,
      label: dayString,
    };
  });

  return barData;
};

const processMonthlyWorkoutData = (
  data: WorkoutDayResults,
  currentDate: Date
) => {
  let labels: string[] = [];
  const { startDate, endDate } = getRangeForPeriod(Period.Month, currentDate);
  const tempStartDate = new Date(startDate);
  const tempEndDate = new Date(endDate);

  while (tempStartDate <= tempEndDate) {
    labels.push(tempStartDate.toLocaleDateString());
    tempStartDate.setDate(tempStartDate.getDate() + 1);
  }

  let barData = labels.map((label) => ({
    label,
    value: 0,
    frontColor: "#d1d5db",
    gradientColor: "#d1d5db",
  }));

  Object.entries(data).forEach(([date, summary]) => {
    const indexOfDate = barData.findIndex((bar) => bar.label === date);
    const isActive = summary.totalWorkout >= 1;
    barData[indexOfDate].value = summary.totalWorkout;
    barData[indexOfDate].frontColor = isActive ? "#ffab00" : "#d1d5db";
    barData[indexOfDate].gradientColor = isActive ? "#ff0000" : "#d1d5db";
  });

  barData = barData.map((item) => {
    const { day } = parseDateString(item.label);
    return {
      ...item,
      label: day.toString(),
    };
  });

  return barData;
};

const processYearlyWorkoutData = (
  data: WorkoutDayResults,
  currentDate: Date
) => {
  let labels: string[] = [];
  const { startDate, endDate } = getRangeForPeriod(Period.Year, currentDate);
  const tempStartDate = new Date(startDate);
  const tempEndDate = new Date(endDate);

  while (tempStartDate <= tempEndDate) {
    labels.push(tempStartDate.getMonth().toString());
    tempStartDate.setMonth(tempStartDate.getMonth() + 1);
  }

  let barData = labels.map((label) => ({
    label,
    value: 0,
    frontColor: "#d1d5db",
    gradientColor: "#d1d5db",
  }));

  Object.entries(data).forEach(([date, summary]) => {
    const { zeroIndexedMonth } = parseDateString(date);
    const indexOfMonth = barData.findIndex(
      (bar) => bar.label === zeroIndexedMonth.toString()
    );
    const isActive = summary.totalWorkout >= 1;
    barData[indexOfMonth].value += summary.totalWorkout;
    barData[indexOfMonth].frontColor = isActive ? "#ffab00" : "#d1d5db";
    barData[indexOfMonth].gradientColor = isActive ? "#ff0000" : "#d1d5db";
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  barData = barData.map((item) => ({
    ...item,
    label: months[parseInt(item.label)],
    frontColor: item.value >= 1 ? "#ffab00" : "#d1d5db",
    gradientColor: item.value >= 1 ? "#ff0000" : "#d1d5db",
  }));

  return barData;
};

export const processChartData = (
  data: WorkoutDayResults,
  category: ChartCategory,
  period: Period,
  currentDate: Date
) => {
  if (category === ChartCategory.Body) {
    return processBodyData(data);
  } else if (category === ChartCategory.Workouts) {
    if (period === Period.Week) {
      return processWeeklyWorkoutData(data, currentDate);
    } else if (period === Period.Month) {
      return processMonthlyWorkoutData(data, currentDate);
    } else if (period === Period.Year) {
      return processYearlyWorkoutData(data, currentDate);
    }
  }
  return [];
};

export const parseDateString = (date: string) => {
  const [month, day, year] = date.split("/").map(Number);

  const zeroIndexedMonth = month - 1;
  return { year, zeroIndexedMonth, day };
};
