export type Image = {
  id: string;
  color: string;
  urls: { regular: string; small: string; raw: string; full: string };
  width: number;
  height: number;
  likes: number;
};

export type Filter = {
  order?: string;
  orientation?: string;
  contentSafty?: string;
  color?: string;
};

export type ImagePresentationParams = {
  id: string;
  url: string;
  width: number;
  height: number;
  likes: number;
};

export type Status = "IDEL" | "LOADING" | "ERROR";
