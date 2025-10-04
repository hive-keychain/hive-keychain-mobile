import "@react-navigation/drawer";
import "@react-navigation/native";
import "@react-navigation/native-stack";

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "@react-navigation/drawer" {
  interface DrawerNavigationOptions {
    id?: string; // make `id` optional
  }
}

declare module "@react-navigation/native-stack" {
  interface NativeStackNavigationOptions {
    id?: string;
  }
}
