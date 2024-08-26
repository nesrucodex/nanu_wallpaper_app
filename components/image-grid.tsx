import { View } from "react-native";
import React from "react";
import { ImagePresentationParams, Image as TImage } from "@/types";

import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./image-card";
import { cn } from "@/lib/cn";

type ImageGridProps = {
  images: TImage[];
  isFiltersSelected: boolean;
  classNames?: {
    container?: string;
  };
  onImagePress: (params: ImagePresentationParams) => void;
};

const ImageGrid = ({
  images,
  classNames,
  isFiltersSelected,
  onImagePress,
 
}: ImageGridProps) => {
  return (
    <View className={cn("w-full min-h-[10vh]", classNames?.container)}>
      <MasonryFlashList
        data={images}
        numColumns={2}
        renderItem={({ item, index }) => (
          <ImageCard image={item} index={index} onImagePress={onImagePress} />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default ImageGrid;
