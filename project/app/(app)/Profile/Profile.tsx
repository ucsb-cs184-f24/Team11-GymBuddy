// Profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import workoutData from "@/data/workoutData.json";
import {
  parseDateTime,
  processChartData,
  getRangeForPeriod,
} from "./helpers/dataProcessHelpers";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SymbolView } from "expo-symbols";
import {
  Period,
  ChartCategory,
  WorkoutDayResults,
} from "@/app/(app)/Profile/helpers/dataProcessHelpers";

const Profile = () => {
  const { width, height } = useWindowDimensions();
  const [chartData, setChartData] = useState<barDataItem[]>([]);
  const [chartPeriod, setChartPeriod] = useState<Period>(Period.Week);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentEndDate, setCurrentEndDate] = useState<Date>(new Date());
  const [chartKey, setChartKey] = useState<number>(0);
  const [chartCategory, setChartCategory] = useState<ChartCategory>(
    ChartCategory.Workouts
  );

  const periodOptions = Object.values(Period);
  const chartCategoryOptions = Object.values(ChartCategory);

  useEffect(() => {
    const fetchData = async () => {
      const { startDate, endDate } = getRangeForPeriod(
        chartPeriod,
        currentDate
      );
      const data = filterData(startDate, endDate);
      const processedData = processChartData(
        data,
        chartCategory,
        chartPeriod,
        currentDate
      );

      setCurrentEndDate(new Date(startDate));
      setChartData(processedData);
      setChartKey((prev) => prev + 1);
    };
    fetchData();
  }, [currentDate, chartCategory, chartPeriod]);

  const filterData = (startDate: number, endDate: number) => {
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

    const result: WorkoutDayResults = {};

    filteredData.forEach((workout) => {
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
      ).toLocaleDateString();

      // Initialize the date key if it doesn't exist
      if (!result[workoutDate]) {
        result[workoutDate] = {
          totalWorkout: 0,
          bodyAreas: {},
        };
      }

      // Increment totalWorkout for the date
      result[workoutDate].totalWorkout += 1;

      const bodyArea = workout.bodyArea;
      // Initialize the body area count if it doesn't exist
      if (!result[workoutDate].bodyAreas[bodyArea]) {
        result[workoutDate].bodyAreas[bodyArea] = 0;
      }
      result[workoutDate].bodyAreas[bodyArea] += 1;
    });

    return result;
  };

  const handlePreviousPeriod = () => {
    if (chartPeriod === Period.Week) {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
    } else if (chartPeriod === Period.Month) {
      // Sets currentDate to the end of the previous month
      setCurrentDate(new Date(currentDate.setDate(0)));
    } else if (chartPeriod === Period.Year) {
      setCurrentDate(
        new Date(currentDate.setFullYear(currentDate.getFullYear() - 1))
      );
    }
  };

  const handleNextPeriod = () => {
    if (chartPeriod === Period.Week) {
      // Prevents showing data in the future
      if (
        currentDate.getDate() === new Date().getDate() &&
        currentDate.getFullYear() === new Date().getFullYear()
      ) {
        return;
      }

      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    } else if (chartPeriod === Period.Month) {
      // Prevents showing data in the future
      if (
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear()
      ) {
        return;
      }

      // We want "monthly" to show a time range of the start and end of the month
      // Sets tempDate to the final day of the next month (note - different months have different amount of days)
      const tempDate = new Date(currentDate);
      tempDate.setDate(1);
      tempDate.setMonth(tempDate.getMonth() + 2);
      tempDate.setDate(0);

      // If at the "present" time frame, show a time range of start of month to today
      if (
        tempDate.getMonth() === new Date().getMonth() &&
        tempDate.getFullYear() === new Date().getFullYear()
      ) {
        setCurrentDate(new Date());
      } else {
        setCurrentDate(tempDate);
      }
    } else if (chartPeriod === Period.Year) {
      // Prevents showing data in the future
      if (currentDate.getFullYear() === new Date().getFullYear()) {
        return;
      }
      setCurrentDate(
        new Date(currentDate.setFullYear(currentDate.getFullYear() + 1))
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.analyticsContainer}>
        <Text style={{ fontSize: 32, fontWeight: "700", marginBottom: 16 }}>
          Analytics
        </Text>
        <SegmentedControl
          values={periodOptions}
          style={{ marginBottom: 10 }}
          selectedIndex={periodOptions.indexOf(chartPeriod)}
          onChange={(event) => {
            const index = event.nativeEvent.selectedSegmentIndex;
            setChartPeriod(periodOptions[index]);
          }}
        />
        <Text
          style={{
            fontSize: 14,
            color: "#5A5A5A",
            fontWeight: "700",
            margin: 5,
            marginBottom: 20,
          }}
        >
          {currentEndDate.toLocaleDateString("en-US", { month: "short" })}{" "}
          {currentEndDate.getDate()} - {currentDate.getDate()},{" "}
          {currentDate.getFullYear()}
        </Text>
        <BarChart
          key={chartKey}
          data={chartData}
          parentWidth={width * 0.85}
          adjustToWidth={true}
          height={200}
          minHeight={3}
          barBorderRadius={3}
          noOfSections={5}
          yAxisThickness={0}
          xAxisThickness={0}
          xAxisLabelTextStyle={{
            color: "gray",
            fontSize: chartData.length > 25 ? 5 : 12,
          }}
          yAxisTextStyle={{ color: "gray" }}
          animationDuration={300}
          showFractionalValues={false}
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
            onPress={handlePreviousPeriod}
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
            values={chartCategoryOptions}
            style={{ width: 180 }}
            selectedIndex={chartCategoryOptions.indexOf(chartCategory)}
            onChange={(event) => {
              const index = event.nativeEvent.selectedSegmentIndex;
              setChartCategory(chartCategoryOptions[index]);
            }}
          />
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={handleNextPeriod}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ECECEC",
  },
  analyticsContainer: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
  },
});

export default Profile;
