/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)/(auth)/Register` | `/(app)/Register` | `/(auth)` | `/(auth)/Register` | `/(auth)/SignIn` | `/(tabs)` | `/(tabs)/Home` | `/(tabs)/Profile` | `/(tabs)/Search` | `/(tabs)/Stats` | `/(tabs)/Workout` | `/Home` | `/Profile` | `/Register` | `/Search` | `/SignIn` | `/Stats` | `/Workout` | `/_sitemap` | `/components/ProfileData` | `/components/pickImage`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
