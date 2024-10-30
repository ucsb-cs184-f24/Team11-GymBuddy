/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)/(auth)/Register` | `/(app)/Register` | `/(auth)` | `/(auth)/Register` | `/(auth)/SignIn` | `/(tabs)` | `/(tabs)/Home/Home` | `/(tabs)/Profile/Profile` | `/(tabs)/Search/Search` | `/(tabs)/Stats/Stats` | `/(tabs)/Workout/Workout` | `/Home/Home` | `/Profile/Profile` | `/Register` | `/Search/Search` | `/SignIn` | `/Stats/Stats` | `/Workout/Workout` | `/_sitemap`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
