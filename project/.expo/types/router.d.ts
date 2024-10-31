/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/Home/page` | `/(app)/NavBar` | `/(app)/Profile/Profile` | `/(app)/Profile/components/ProfileData` | `/(app)/Profile/components/pickImage` | `/(app)/Search/Search` | `/(app)/Stats/Stats` | `/(app)/Workout/Workout` | `/(auth)` | `/(auth)/Register` | `/(auth)/page` | `/Home/page` | `/NavBar` | `/Profile/Profile` | `/Profile/components/ProfileData` | `/Profile/components/pickImage` | `/Register` | `/Search/Search` | `/Stats/Stats` | `/Workout/Workout` | `/_sitemap` | `/page`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
