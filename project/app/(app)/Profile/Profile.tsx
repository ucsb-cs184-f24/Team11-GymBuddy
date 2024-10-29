// Home.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import workoutData from "@/data/workoutData.json";
import { parseDateTime, processWeeklyData } from "./helpers/dataProcessHelpers";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SymbolView } from "expo-symbols";
import Card from "@/components/Card";

enum Period {
  week = "week",
  month = "month",
  year = "year",
}

const Profile = () => {
  const [chartData, setChartData] = useState<barDataItem[]>([]);
  const [chartPeriod, setChartPeriod] = useState<Period>(Period.week);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentEndDate, setCurrentEndDate] = useState<Date>(new Date());
  const [chartKey, setChartKey] = useState<number>(0);
  const [chartCategory, setChartCategory] = useState<"Workouts" | "Body">(
    "Workouts"
  );

  useEffect(() => {
    const fetchData = async () => {
      if (chartPeriod === Period.week) {
        const { startDate, endDate } = getWeekRange(currentDate);
        setCurrentEndDate(new Date(endDate));

        const data = fetchWeeklyData(startDate, endDate, chartCategory);
        const processedData = processWeeklyData(data, chartCategory);
        setChartData(processedData);
        setChartKey((prev) => prev + 1);
      }
    };
    fetchData();
  }, [currentDate, chartCategory]);

  const fetchWeeklyData = (
    startDate: number,
    endDate: number,
    category: "Workouts" | "Body"
  ) => {
    const filteredData = workoutData.filter((workout) => {
      const { year, zeroIndexedMonth, day, hour, minute } = parseDateTime(
        workout.date,
        workout.time
      );
      const workoutDate = new Date(
        year,
        zeroIndexedMonth,
        day,
        hour,
        minute
      ).getTime();
      return workoutDate >= startDate && workoutDate <= endDate;
    });

    if (category === "Workouts") {
      // Group workouts by day of the week
      const dayOfWeekCount: { [key: number]: number } = {};

      filteredData.forEach((workout) => {
        const { year, zeroIndexedMonth, day, hour, minute } = parseDateTime(
          workout.date,
          workout.time
        );
        const dayOfWeek = new Date(
          year,
          zeroIndexedMonth,
          day,
          hour,
          minute
        ).getDay();
        dayOfWeekCount[dayOfWeek] = (dayOfWeekCount[dayOfWeek] || 0) + 1;
      });

      return Object.entries(dayOfWeekCount).map(([day, total]) => ({
        day_of_week: parseInt(day),
        total,
      }));
    } else if (category === "Body") {
      // Group workouts by body area
      const bodyAreaCount: { [key: string]: number } = {};

      filteredData.forEach((workout) => {
        const bodyArea = workout.bodyArea;
        bodyAreaCount[bodyArea] = (bodyAreaCount[bodyArea] || 0) + 1;
      });

      return Object.entries(bodyAreaCount).map(([body_area, total]) => ({
        body_area,
        total,
      }));
    }
    return [];
  };

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(date);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      startDate: startOfWeek.getTime(),
      endDate: endOfWeek.getTime(),
    };
  };

  const handlePreviousWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  };

  return (
    <SafeAreaView style={{ margin: 15 }}>
      <Card>
        <Text style={styles.text}>Profile</Text>
        <BarChart
          key={chartKey}
          data={chartData}
          height={200}
          width={290}
          barWidth={18}
          minHeight={3}
          barBorderRadius={3}
          spacing={20}
          noOfSections={5}
          yAxisThickness={0}
          xAxisThickness={0}
          xAxisLabelTextStyle={{ color: "gray" }}
          yAxisTextStyle={{ color: "gray" }}
          animationDuration={300}
          dashGap={10}
          isAnimated
          showGradient
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => handlePreviousWeek()}
          >
            <SymbolView
              name="chevron.left.circle.fill"
              size={40}
              type="hierarchical"
              tintColor={"gray"}
            />
            <Text style={{ fontSize: 11, color: "gray" }}>prev</Text>
          </TouchableOpacity>
          <SegmentedControl
            values={["Workouts", "Body"]}
            style={{ width: 180 }}
            selectedIndex={chartCategory === "Workouts" ? 0 : 1}
            onChange={(event) => {
              const index = event.nativeEvent.selectedSegmentIndex;
              setChartCategory(index === 0 ? "Workouts" : "Body");
            }}
          />
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => handleNextWeek()}
          >
            <SymbolView
              name="chevron.right.circle.fill"
              size={40}
              type="hierarchical"
              tintColor={"gray"}
            />
            <Text style={{ fontSize: 11, color: "gray" }}>next</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Profile;
