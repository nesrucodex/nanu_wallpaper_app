import { fetchImages, TFilter } from "@/api";
import { Image, Status } from "@/types";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useFetchImage = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [fetchStatus, setFetchStatus] = useState<Status | "EMPTY">("IDEL");

  const isEmptyImages = images.length === 0;
  const getImages = useCallback(
    async ({
      searchQuery,
      activeCatagory,
      filter,
      append = false,
      page = 1,
    }: {
      searchQuery?: string;
      activeCatagory?: string;
      append?: boolean;
      filter?: TFilter;
      page?: number;
    }) => {
      if (!searchQuery && !activeCatagory)
        return Alert.alert(
          "Warning",
          "Please search or select catagory before filtering."
        );

      setFetchStatus("LOADING");
      if (!append) setImages([]);
      const response = await fetchImages({
        query: searchQuery || activeCatagory,
        ...filter,
        page,
      });
      if (!response.success) {
        setFetchStatus("ERROR");
        Alert.alert("Error 👀", response.message);
        return;
      }

      if (append) {
        return setImages((prev) => {
          if ([...prev, ...response.data].length === 0) setFetchStatus("EMPTY");
          else setFetchStatus("IDEL");
          return [...prev, ...response.data];
        });
      }

      if (response.data.length === 0) setFetchStatus("EMPTY");
      else setFetchStatus("IDEL");
      return setImages(response.data);
    },
    []
  );

  return { fetchStatus, isEmptyImages, images, setImages, getImages };
};
