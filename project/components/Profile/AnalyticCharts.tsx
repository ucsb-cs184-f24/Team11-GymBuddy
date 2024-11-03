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
import {
  processChartData,
  getRangeForPeriod,
  Period,
  ChartCategory,
  WorkoutDayResults,
} from "@/utils/Profile/dataProcessHelpers";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SymbolView } from "expo-symbols";
import { getWorkouts, getUserId } from "@/databaseService";

type WorkoutEntry = {
  category: string;
  date: number;
  workouts: string[];
};

const AnalyticCharts = () => {
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
      const userId = await getUserId();
      const workoutData = await getWorkouts(userId);
      const data = await filterData(startDate, endDate, workoutData);
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

  const filterData = async (
    startDate: number,
    endDate: number,
    workoutData: { [key: string]: WorkoutEntry }
  ) => {
    const result: WorkoutDayResults = {};

    Object.entries(workoutData).forEach(([_, workout]) => {
      const workoutDate = new Date(workout.date * 1000).getTime(); // Convert UNIX timestamp to milliseconds

      // Check if the workout date is within the specified range
      if (workoutDate >= startDate && workoutDate <= endDate) {
        const formattedDate = new Date(
          workout.date * 1000
        ).toLocaleDateString();

        // Initialize the date key if it doesn't exist
        if (!result[formattedDate]) {
          result[formattedDate] = {
            totalWorkout: 0,
            bodyAreas: {},
          };
        }

        const category = workout.category;
        const numWorkouts = workout.workouts.length;

        // Increment totalWorkout for the date
        result[formattedDate].totalWorkout += numWorkouts;

        // Initialize the body area count if it doesn't exist
        if (!result[formattedDate].bodyAreas[category]) {
          result[formattedDate].bodyAreas[category] = 0;
        }
        result[formattedDate].bodyAreas[category] += numWorkouts;
      }
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
        <Text style={styles.analyticsTitle}>Analytics</Text>
        <SegmentedControl
          values={periodOptions}
          style={styles.segmentedControl}
          selectedIndex={periodOptions.indexOf(chartPeriod)}
          onChange={(event) => {
            const index = event.nativeEvent.selectedSegmentIndex;
            setChartPeriod(periodOptions[index]);
          }}
        />
        <Text style={styles.dateRange}>
          {currentEndDate.toLocaleDateString("en-US", { month: "short" })}{" "}
          {currentEndDate.getDate()}, {currentEndDate.getFullYear()} -{" "}
          {currentDate.toLocaleDateString("en-US", { month: "short" })}{" "}
          {currentDate.getDate()}, {currentDate.getFullYear()}
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
          yAxisTextStyle={styles.axisText}
          animationDuration={300}
          showFractionalValues={false}
          isAnimated
          showGradient
        />
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={handlePreviousPeriod}
          >
            <SymbolView
              name="chevron.left.circle.fill"
              size={40}
              type="hierarchical"
              tintColor="gray"
            />
            <Text style={styles.navigationText}>prev</Text>
          </TouchableOpacity>
          <SegmentedControl
            values={chartCategoryOptions}
            style={styles.segmentedControl}
            selectedIndex={chartCategoryOptions.indexOf(chartCategory)}
            onChange={(event) => {
              const index = event.nativeEvent.selectedSegmentIndex;
              setChartCategory(chartCategoryOptions[index]);
            }}
          />
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={handleNextPeriod}
          >
            <SymbolView
              name="chevron.right.circle.fill"
              size={40}
              type="hierarchical"
              tintColor="gray"
            />
            <Text style={styles.navigationText}>next</Text>
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
    marginVertical: 20,
  },
  analyticsContainer: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
  },
  analyticsTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 16,
  },
  segmentedControl: {
    marginBottom: 10,
  },
  dateRange: {
    fontSize: 14,
    color: "#5A5A5A",
    fontWeight: "700",
    marginVertical: 5,
    marginBottom: 20,
  },
  axisText: {
    color: "gray",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 16,
  },
  navigationButton: {
    alignItems: "center",
  },
  navigationText: {
    fontSize: 11,
    color: "gray",
  },
});

export default AnalyticCharts;