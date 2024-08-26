import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { Images } from "@/utils/assets";

import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Welcome = () => {
  const router = useRouter();
  return (
    <View className="w-full h-full">
      <Image
        source={Images.welcome}
        resizeMode="cover"
        className="w-full h-full absolute"
      />
      <Animated.View
        entering={FadeInDown.duration(600)}
        className="w-full h-full"
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255, 0)",
            "rgba(255,255,255, 0.5)",
            "white",
            "white",
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute bottom-0 left-0 w-full h-[400px]"
        />

        <View className="flex-1 justify-end items-center">
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            className="text-6xl font-bold py-3"
          >
            Nanu📌
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
            className="text-lg font-pregular text-slate-900 mb-8"
          >
            Every Pixel has a Meaning.
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            className="w-full flex items-center"
          >
            <Pressable
              className="bg-slate-900 mb-10 w-[80%] flex items-center justify-center h-14 rounded-2xl"
              style={{ borderCurve: "continuous" }}
              onPress={() => {
                router.push("/home");
              }}
            >
              <Text className="text-white text-xl tracking-wider font-pmedium">
                Start Explore
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>

      <StatusBar style="light" />
    </View>
  );
};

export default Welcome;
