import { Env } from "@/config/env";
import axios from "axios";

export type TFilter = {
  order?: string;
  color?: string;
  contentSafty?: string;
  orientation?: string;
};

export type SearchParams = {
  query?: string;
  page?: number;
  perPage?: number;
} & TFilter;

type APIResponse = {
  success: boolean;
  message: string;
  data: any;
};

const BaseUrl = `https://api.unsplash.com/search/photos?client_id=${Env.ACCESS_KEY}`;

export const fetchImages = async ({
  order,
  color,
  contentSafty,
  orientation,
  query = "Wallpaper",
  page = 1,
  perPage = 25,
}: SearchParams): Promise<APIResponse> => {
  const url = new URL(BaseUrl);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));
  if (order) url.searchParams.set("order_by", order.toLowerCase());
  if (color) url.searchParams.set("color", color.toLowerCase());
  if (contentSafty)
    url.searchParams.set("content_filter", contentSafty.toLowerCase());
  if (orientation)
    url.searchParams.set("orientation", orientation.toLowerCase());

  // console.log({ url: url.toString() });

  try {
    const response = await axios.get(url.toString());

    return {
      success: true,
      message: "Images fetched successfully",
      data: response.data.results,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch images",
      data: null,
    };
  }
};
