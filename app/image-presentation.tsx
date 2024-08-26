import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { PropsWithChildren, useState } from "react";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Images } from "@/utils/assets";
import { Entypo, MaterialIcons, Octicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import ManageWallpaper, { TYPE } from "react-native-manage-wallpaper";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";

import { ImagePresentationParams, Status } from "@/types";

const ImagePresentationScreen = () => {
  const params =
    useLocalSearchParams() as unknown as ImagePresentationParams & {
      width: string;
      height: string;
    };
  const router = useRouter();

  const { width: windowWidth } = useWindowDimensions();

  const [imageStatus, setImageStatus] = useState<Status>("LOADING");
  const [downloadStatus, setdownloadStatus] = useState<Status>("IDEL");
  const [sharingStatus, setSharingStatus] = useState<Status>("IDEL");
  const [wallpaperStatus, setWallpaperStatus] = useState<Status>("IDEL");

  const onLoad = () => {
    setImageStatus("IDEL");
  };

  const downloadFile = async () => {
    try {
      const result = await FileSystem.downloadAsync(
        params.url,
        `${FileSystem.documentDirectory}natupic-${Math.round(
          Math.random() * 100_000
        )}.png`
      );
      return result.uri;
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Unable to to download a picture, try again.",
      });

      return null;
    }
  };

  const handelDownload = async () => {
    setdownloadStatus("LOADING");
    const uri = await downloadFile();
    if (!uri) {
      Toast.show({
        type: "error",
        text1: "Unable to to download a picture, try again.",
      });

      setdownloadStatus("IDEL");
      return;
    }

    Toast.show({
      type: "success",
      text1: `Picture downloaded at ${uri} successfully.`,
    });

    setdownloadStatus("IDEL");
  };

  const handleSharing = async () => {
    setSharingStatus("LOADING");
    const uri = await downloadFile();
    if (!uri) {
      Toast.show({
        type: "error",
        text1: "Unable to to load a picture, try again.",
      });

      setSharingStatus("IDEL");
      return;
    }
    try {
      await Sharing.shareAsync(uri);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Unable to share a picture, try again.",
      });
    } finally {
      setSharingStatus("IDEL");
    }
  };

  const handleSettingWallpaper = async () => {
    setWallpaperStatus("LOADING");
    try {
      ManageWallpaper.setWallpaper(
        { uri: params.url },
        (res) => {
          console.log({ res });
          Toast.show({
            type: "success",
            text1: "Wallpaper set successfully.",
          });
        },
        TYPE.HOME
      );
    } catch (error: any) {
      console.log({ error });
      Toast.show({
        type: "error",
        text1: error?.message || "Unable to set the wallpaper, try again.",
      });
    } finally {
      setWallpaperStatus("IDEL");
    }
  };

  const getImageDimentions = (width: number, height: number) => {
    const aspectRatio = width / height;

    const maxWidth = windowWidth * 0.92;

    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) calculatedWidth = calculatedHeight * aspectRatio;

    return { width: calculatedWidth, height: calculatedHeight };
  };

  const getFormatedLikes = (likes: number) => {
    if (likes > 1000) {
      return `${Math.floor(likes / 1000)}k`;
    } else {
      return likes.toString();
    }
  };

  return (
    <BlurView
      tint="dark"
      intensity={50}
      // experimentalBlurMethod="dimezisBlurView"
      className="w-full h-full items-center justify-center bg-black/50"
    >
      <Image
        source={Images.blur}
        className="absolute inset-0 w-full h-full "
        contentFit="cover"
      />

      {imageStatus === "LOADING" && (
        <View className="absolute w-full h-full inset-0 flex items-center justify-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <View
        className="relative rounded-xl overflow-hidden bg-gray-200/70 border-2 border-white/50"
        style={getImageDimentions(
          parseInt(params.width),
          parseInt(params.height)
        )}
      >
        {params.likes && (
          <View className="absolute z-[99] -top-1 left-0 flex flex-row items-center gap-x-2 bg-white/60 p-2 pt-3 rounded-lg">
            <Octicons name="heart-fill" color="red" size={20} />
            <Text className="text-black font-psemibold">
              {getFormatedLikes(+params.likes)}
            </Text>
          </View>
        )}
        <Image
          source={params.url}
          className="w-full h-full "
          contentFit="cover"
          onLoad={onLoad}
          transition={100}
        />
      </View>
      <View className="flex-row gap-x-8 mt-12">
        <Animated.View entering={FadeInDown.springify(100)}>
          <ActionButton
            onPress={() => {
              router.back();
            }}
          >
            <Octicons name="x" size={24} color="white" />
          </ActionButton>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ActionButton onPress={() => handelDownload()}>
            {downloadStatus === "IDEL" ? (
              <Octicons name="download" size={24} color="white" />
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </ActionButton>
        </Animated.View>
        {/* <Animated.View entering={FadeInDown.delay(300).springify()}>
          <ActionButton onPress={() => handleSettingWallpaper()}>
            {wallpaperStatus === "IDEL" ? (
              <MaterialIcons name="now-wallpaper" size={24} color="white" />
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </ActionButton>
        </Animated.View> */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <ActionButton onPress={() => handleSharing()}>
            {sharingStatus === "IDEL" ? (
              <Entypo name="share" size={24} color="white" />
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </ActionButton>
        </Animated.View>
      </View>
      <Toast
        position="bottom"
        bottomOffset={-35}
        config={{
          success: ({ text1 }) => (
            <View className="bg-white/20 border-[2px] border-white/50 px-5 py-2 rounded-xl">
              <Text className="text-white">{text1}</Text>
            </View>
          ),
          error: ({ text1 }) => (
            <View className="bg-red-900/20 border-[2px] border-red-900/50 px-5 py-2.5 rounded-xl">
              <Text className="text-white">{text1}</Text>
            </View>
          ),
        }}
        visibilityTime={3000}
      />
    </BlurView>
  );
};

const ActionButton = ({
  children,
  onPress,
}: PropsWithChildren & { onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white/20 w-[45] h-[45px] border-[2px] border-white/50 flex items-center justify-center rounded-lg"
    >
      {children}
    </Pressable>
  );
};

export default ImagePresentationScreen;
