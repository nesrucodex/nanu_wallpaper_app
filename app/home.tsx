import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Catagory from "@/components/catagory";
import ImageGrid from "@/components/image-grid";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/cn";
import { StatusBar } from "expo-status-bar";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import FilterBotttomSheet from "@/components/bottom-sheet";

import { useFetchImage } from "@/hooks/use-fetch-image";
import SearchBar from "@/components/home/search-bar";
import Header from "@/components/home/header";
import FiltersOutput from "@/components/home/filters-output";

import { Filter, ImagePresentationParams, Image as TImage } from "@/types";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Images } from "@/utils/assets";

const Home = () => {
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("inspiration");
  const [activeCatagory, setActiveCatagory] = useState<null | string>();
  const { fetchStatus, isEmptyImages, images, getImages } = useFetchImage();
  const bottomSheetModelRef = useRef<BottomSheetModal>(null);
  const [filter, setFilter] = useState<Filter>();
  const scrollRef = useRef<ScrollView | null>(null);
  const pageRef = useRef<number>(1);
  const [pageDataFinished, setPageDataFinished] = useState(true);
  const router = useRouter();

  const paddingTop = top > 0 ? top + 5 : 30;
  const isFiltersSelected =
    !!filter &&
    Object.keys(filter).filter((key) => filter[key as keyof Filter]).length > 0;

  const handleDrawerPresent = () => {
    bottomSheetModelRef.current?.present();
  };
  const handleDrawerDismiss = () => bottomSheetModelRef.current?.dismiss();

  const onFilterChange = (key: keyof Filter, data: string) => {
    if (filter && filter[key] === data)
      return setFilter((prev) => ({ ...prev, [key]: undefined }));

    setFilter((prev) => ({ ...prev, [key]: data }));
  };

  const removeFilter = async (key: keyof Filter) => {
    pageRef.current = 1;
    const updatedFilter = { ...filter, [key]: undefined };
    setFilter(updatedFilter);
    await getImages({
      searchQuery,
      activeCatagory: activeCatagory || undefined,
      filter: updatedFilter,
    });
  };

  const applyFilter = async () => {
    pageRef.current = 1;
    handleDrawerDismiss();
    await getImages({
      searchQuery,
      activeCatagory: activeCatagory || undefined,
      filter,
    });
  };

  const resetFilter = async () => {
    pageRef.current = 1;
    setFilter({});
    handleDrawerDismiss();
    await getImages({
      searchQuery,
      activeCatagory: activeCatagory || undefined,
    });
  };

  const handelSearch = async (searchQuery: string) => {
    pageRef.current = 1;
    if (searchQuery.trim().length < 1) return;
    setActiveCatagory(null);
    setSearchQuery(searchQuery);
    await getImages({ searchQuery, filter });
  };

  const clearSearchQuery = async () => {
    pageRef.current = 1;
    setSearchQuery("");
    await getImages({
      searchQuery: "",
      activeCatagory: activeCatagory || undefined,
      filter,
    });
  };

  const handelCatagorySelection = async (catagory: string) => {
    pageRef.current = 1;
    setSearchQuery("");
    setActiveCatagory((prev) => (prev === catagory ? null : catagory));
    await getImages({ activeCatagory: catagory, filter });
  };

  const debouncedHandelSearch = useDebouncedCallback(handelSearch, 400);

  const handelScroll = async (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const {
      contentOffset: { y },
      contentSize: { height: contentHeight },
      layoutMeasurement: { height: layoutHeight },
    } = event.nativeEvent;

    if (y + layoutHeight === contentHeight) {
      if (pageDataFinished) {
        setPageDataFinished(false);
        await getImages({
          append: true,
          page: pageRef.current + 1,
          searchQuery,
          activeCatagory: activeCatagory || undefined,
          filter,
        });
        pageRef.current += 1;
        setPageDataFinished(true);
      }
    }
  };
  const handelScrollUp = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const presentImage = (params: ImagePresentationParams) => {
    router.push({ pathname: "/image-presentation", params });
  };

  useEffect(() => {
    (async () => {
      await getImages({
        searchQuery,
        activeCatagory: activeCatagory || undefined,
        filter,
      });
    })();
  }, []);

  return (
    <View className="px-4 bg-black/10" style={{ paddingTop }}>
      <Image
        source={Images.blur}
        className="absolute inset-0 w-full h-full "
        contentFit="cover"
      />
      <Header
        onTitlePress={handelScrollUp}
        handleDrawerPresent={handleDrawerPresent}
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={5}
        className="mt-3"
        onScroll={handelScroll}
      >
        <View className="mb-1 flex flex-row items-center  ">
          <SearchBar
            onSearch={debouncedHandelSearch}
            searchQuery={searchQuery}
            onClear={clearSearchQuery}
          />
          <Catagory
            onSelect={handelCatagorySelection}
            activeCategory={activeCatagory || ""}
          />
        </View>
        <View className="mb-3">
          <FiltersOutput filter={filter} removeFilter={removeFilter} />
        </View>

        <View className="mb-14 min-h-[83vh]">
          {!isEmptyImages && (
            <ImageGrid
              images={images}
              isFiltersSelected={isFiltersSelected}
              onImagePress={presentImage}
            />
          )}
          {fetchStatus === "EMPTY" && (
            <Text className="text-center text-lg mt-10 text-neutral-800 font-light">
              No pictures found with a given filter. try changing filters ✔
            </Text>
          )}

          {fetchStatus === "LOADING" && (
            <View
              className={cn("items-center mt-4", {
                "mt-4": fetchStatus === "LOADING",
              })}
            >
              <ActivityIndicator size="large" color="black" />
            </View>
          )}
        </View>
      </ScrollView>

      <FilterBotttomSheet
        ref={bottomSheetModelRef}
        filter={filter}
        onFilterChange={onFilterChange}
        resetFilter={resetFilter}
        applyFilter={applyFilter}
      />
      <StatusBar style="dark" />
    </View>
  );
};

export default Home;
