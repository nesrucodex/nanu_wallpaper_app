import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

type HeaderProps = {
  onTitlePress: () => void;
  handleDrawerPresent: () => void;
};
const Header = ({ onTitlePress, handleDrawerPresent }: HeaderProps) => {
  const router = useRouter();
  return (
    <View className="flex flex-row items-center justify-between">
      <Pressable onPress={() => onTitlePress()}>
        <Text className="text-3xl font-medium">Nanu📌</Text>
      </Pressable>
      <TouchableOpacity
        activeOpacity={75}
        onPress={() => handleDrawerPresent()}
      >
        <FontAwesome6 name="bars-staggered" size={24} color="#000a" />
      </TouchableOpacity>
    </View>
  );
};
export default Header;
