import { Filter } from "@/types";
import { neutral } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View, Text, Pressable } from "react-native";

type FilterOutputsProps = {
  filter: Filter | undefined;
  removeFilter: (key: keyof Filter) => void;
};
const FiltersOutput = ({ filter, removeFilter }: FilterOutputsProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex flex-row gap-x-2 items-center">
        {filter &&
          Object.keys(filter)
            .filter((key) => filter[key as keyof Filter])
            .map((key) => (
              <View
                key={key}
                className="flex flex-row px-2.5 py-1 items-center border border-zinc-100 rounded-xl"
              >
                {key === "color" ? (
                  <View
                    style={{ backgroundColor: filter[key as keyof Filter] }}
                    className="w-6 h-6 rounded-md"
                  />
                ) : (
                  <Text>{filter[key as keyof Filter]}</Text>
                )}
                <Pressable
                  onPress={() => removeFilter(key as keyof Filter)}
                  className="bg-zinc-200/80 p-1.5 rounded-md ml-3"
                >
                  <Ionicons name="close" size={14} color={neutral(0.8)} />
                </Pressable>
              </View>
            ))}
      </View>
    </ScrollView>
  );
};

export default FiltersOutput;
