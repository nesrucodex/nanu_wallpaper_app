import { View, Text } from "react-native";
import React, { PropsWithChildren, ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { cn } from "@/lib/cn";

type ScreenWrapperProps = {
  children: ReactNode;
  className?: string;
};
const ScreenWrapper = ({ children, className }: ScreenWrapperProps) => {
  return (
    <SafeAreaView >
      <View className={cn("w-full h-full", className)}>{children}</View>
      <StatusBar style="dark" backgroundColor="#161621" translucent  />
    </SafeAreaView>
  );
};

export default ScreenWrapper;
