import { cn } from "@/lib/cn";
import { neutral } from "@/utils";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

type SearchBarProps = {
  searchQuery: string;
  onSearch: (query: string) => void;
  onClear: () => void;
};

const SearchBar = ({ searchQuery, onSearch, onClear }: SearchBarProps) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  return (
    <View className="w-fullflex mr-4 flex-row border border-zinc-100 rounded-xl items-center px-2 py-2">
      <Pressable
        className={cn({ "mr-2": showSearchInput })}
        onPress={() => setShowSearchInput((prev) => !prev)}
      >
        <Feather name="search" size={24} color="#0009" />
      </Pressable>
      {showSearchInput && (
        <TextInput
          defaultValue={searchQuery}
          onChangeText={onSearch}
          className="flex-1 text-base text-zinc-700"
          placeholder="Search photos..."
        />
      )}

      {searchQuery && showSearchInput && (
        <Pressable
          onPress={() => onClear()}
          className="bg-zinc-200 p-2 rounded-xl"
        >
          <Ionicons name="close" size={20} color={neutral(0.6)} />
        </Pressable>
      )}
    </View>
  );
};

export default SearchBar;
