import { View, Text, FlatList, Pressable } from "react-native";
import React from "react";
import { CATAGORIES } from "@/constants/catagories";
import { cn } from "@/lib/cn";
import Animated, { FadeInRight } from "react-native-reanimated";

type CatagoryProps = {
  onSelect: (catagory: string) => void;
  activeCategory: string;
};
const Catagory = ({ onSelect, activeCategory }: CatagoryProps) => {
  return (
    <View>
      <FlatList
        className="py-2"
        contentContainerStyle={{ paddingRight: 10, gap: 5 }}
        data={CATAGORIES}
        horizontal
        bounces
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <CatagoryItem
            onSelect={onSelect}
            title={item}
            index={index}
            isActive={activeCategory === item}
          />
        )}
      />
    </View>
  );
};

type CatagoryItemProps = {
  title: string;
  index: number;
  isActive?: boolean;
  onSelect: (catagory: string) => void;
};
const CatagoryItem = ({
  title,
  index,
  onSelect,
  isActive = false,
}: CatagoryItemProps) => {
  return (
    <Animated.View entering={FadeInRight.delay(index*200).duration(800).springify().damping(14)}>
      <Pressable
        className={cn("border border-zinc-100 rounded-xl", {
          "bg-black": isActive,
        })}
        onPress={() => onSelect(title)}
      >
        <Text className={cn(" py-2 px-5", { "text-white": isActive })}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
export default Catagory;
