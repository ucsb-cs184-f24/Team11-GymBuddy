/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/(tabs)` | `/(app)/(tabs)/Home/Home` | `/(app)/(tabs)/Profile/Profile` | `/(app)/(tabs)/Search/Search` | `/(app)/(tabs)/Stats/Stats` | `/(app)/(tabs)/Workout/Workout` | `/(app)/Home/Home` | `/(app)/NavBar` | `/(app)/Profile/Profile` | `/(app)/Search/Search` | `/(app)/Stats/Stats` | `/(app)/Workout/Workout` | `/(auth)` | `/(auth)/Register` | `/(auth)/page` | `/(tabs)` | `/(tabs)/Home/Home` | `/(tabs)/Profile/Profile` | `/(tabs)/Search/Search` | `/(tabs)/Stats/Stats` | `/(tabs)/Workout/Workout` | `/Home/Home` | `/NavBar` | `/Profile/Profile` | `/Register` | `/Search/Search` | `/Stats/Stats` | `/Workout/Workout` | `/_sitemap` | `/page`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
