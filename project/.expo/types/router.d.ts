/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/Home/page` | `/(auth)` | `/(auth)/Register` | `/(auth)/page` | `/Home/page` | `/Register` | `/_sitemap` | `/page`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
