import { View, Text, Pressable } from "react-native";
import React from "react";
import { ImagePresentationParams, Image as TImage } from "@/types";

import { Image } from "expo-image";
import { cn } from "@/lib/cn";

type ImageCardProps = {
  image: TImage;
  index: number;
  onImagePress: (params: ImagePresentationParams) => void;
};

const ImageCard = ({ image, index, onImagePress }: ImageCardProps) => {
  const getImageHeight = (width: number, height: number) => {
    if (width > height) return 230;
    else if (width < height) return 280;
    return 180;
  };

  const isLastRow = () => {
    return index % 2 === 0;
  };
  return image?.urls?.small ? (
    <Pressable
      className={cn("rounded-xl overflow-hidden mb-2 bg-zinc-200/70", {
        "mr-2": isLastRow(),
      })}
      onPress={() =>
        onImagePress({
          id: image.id,
          url: image.urls.small,
          width: image.width,
          height: image.height,
          likes: image.likes,
        })
      }
    >
      <Image
        source={image.urls.small}
        className={cn("w-full")}
        style={{
          height: getImageHeight(image.width, image.height),
        }}
        transition={300}
      />
    </Pressable>
  ) : null;
};

export default ImageCard;
