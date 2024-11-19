/* eslint-disable */
import * as Router from "expo-router";

export * from "expo-router";

declare module "expo-router" {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string>
      extends Record<string, unknown> {
      StaticRoutes:
        | `/`
        | `/(auth)`
        | `/(auth)/Register`
        | `/(auth)/SignIn`
        | `/(tabs)`
        | `/(tabs)/Home`
        | `/(tabs)/Profile`
        | `/(tabs)/Search`
        | `/(tabs)/Stats`
        | `/(tabs)/Workout`
        | `/Home`
        | `/Profile`
        | `/Register`
        | `/Search`
        | `/SignIn`
        | `/Stats`
        | `/Workout`
        | `/_sitemap`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
