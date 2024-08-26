import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { forwardRef, useMemo } from "react";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { BlurView } from "expo-blur";
import { cn } from "@/lib/cn";
import { Filter } from "@/types";

import * as FilterData from "@/constants/filter";

import Animated, { FadeInDown } from "react-native-reanimated";
import { Image } from "expo-image";
import { Images } from "@/utils/assets";

type FilterBotttomSheetProps = {
  filter: Filter | undefined;
  onFilterChange: (key: keyof Filter, data: string) => void;
  resetFilter: () => void;
  applyFilter: () => void;
};

const FilterBotttomSheet = forwardRef<
  BottomSheetModal,
  FilterBotttomSheetProps
>(({ filter, onFilterChange, applyFilter, resetFilter }, ref) => {
  const snapSpots = useMemo(() => ["80%"], []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapSpots}
      index={0}
      enablePanDownToClose={true}
      backdropComponent={DrawerBackdrop}
    >
      <BottomSheetView>
        <View className="flex flex-col w-full px-4 h-full bg-black/10 relative">
          <Image
            source={Images.blur}
            className="absolute inset-0 w-full h-full"
            contentFit="cover"
          />
          <Text className="text-3xl mt-2 font-semibold  tracking-wider text-zinc-800 mb-4">
            Filters
          </Text>

          <View style={{ flexDirection: "column", gap: 15 }}>
            <Section
              title="Order"
              index={1}
              filterKey="order"
              activeFilter={filter?.order}
              data={FilterData.Order}
              onFilterChange={onFilterChange}
            />
            <Section
              title="Orientation"
              index={2}
              filterKey="orientation"
              activeFilter={filter?.orientation}
              data={FilterData.Orientation}
              onFilterChange={onFilterChange}
            />
            <Section
              title="Content Safty"
              index={3}
              filterKey="contentSafty"
              activeFilter={filter?.contentSafty}
              data={FilterData.ContentSafty}
              onFilterChange={onFilterChange}
            />
            <Section
              title="Colors"
              index={4}
              filterKey="color"
              type="color"
              activeFilter={filter?.color}
              data={FilterData.Color}
              onFilterChange={onFilterChange}
            />
          </View>

          <Animated.View
            entering={FadeInDown.delay(400).springify().damping(11)}
            className="flex flex-row items-center justify-between mt-auto pb-2"
          >
            <TouchableOpacity
              activeOpacity={75}
              style={{ borderCurve: "continuous" }}
              className="w-[47%] border border-zinc-50 items-center bg-zinc-200/50 py-3 rounded-xl"
              onPress={() => resetFilter()}
            >
              <Text className="font-semibold tracking-wide">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={75}
              style={{ borderCurve: "continuous" }}
              className="w-[47%] border  border-zinc-50 items-center py-3 rounded-xl bg-zinc-800"
              onPress={() => applyFilter()}
            >
              <Text className="font-semibold tracking-wide text-white">
                Apply
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

type SectionProps = {
  title: string;
  data: string[];
  type?: "default" | "color";
  filterKey: keyof Filter;
  onFilterChange: (filterKey: keyof Filter, data: string) => void;
  activeFilter?: string;
  index: number;
};
const Section = ({
  title,
  data,
  onFilterChange,
  filterKey,
  activeFilter,
  index,
  type = "default",
}: SectionProps) => {
  const isColor = type === "color";
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .springify()
        .damping(11)}
    >
      <Text className="text-xl font-semibold text-zinc-800 mb-2">{title}</Text>
      <View className="flex flex-row flex-wrap gap-3">
        {data.map((item) => (
          <TouchableOpacity
            activeOpacity={75}
            key={item}
            className={cn(
              "rounded-xl overflow-hidden border border-zinc-50",
              { "px-4 py-2": !isColor },
              { "p-1": isColor },
              {
                "bg-zinc-800": activeFilter === item && !isColor,
              },
              {
                "border-zinc-800 border-[2px]":
                  activeFilter === item && isColor,
              }
            )}
            onPress={() => onFilterChange(filterKey, item)}
          >
            {!isColor ? (
              <Text
                className={cn({
                  "text-white": activeFilter === item,
                })}
              >
                {item}
              </Text>
            ) : (
              <View
                style={{ backgroundColor: item }}
                className={cn("w-[50] h-[35] rounded-xl")}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const DrawerBackdrop = () => {
  return (
    <View className="absolute inset-0 w-full h-full ">
      <BlurView
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        intensity={15}
        className="absolute inset-0 w-full h-full bg-black/20"
      />
    </View>
  );
};

export default FilterBotttomSheet;
