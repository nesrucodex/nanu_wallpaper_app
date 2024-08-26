// react-native-manage-wallpaper.d.ts
declare module "react-native-manage-wallpaper" {
  import { ImageSourcePropType } from "react-native";

  export const TYPE: {
    HOME: "home";
    LOCK: "lock";
    BOTH: "both";
  };

  export type WallpaperType = (typeof TYPE)[keyof typeof TYPE];

  interface ManageWallpaper {
    setWallpaper(
      source: ImageSourcePropType,
      callback?: (res: any) => void,
      type?: WallpaperType
    ): void;
  }

  const ManageWallpaper: ManageWallpaper;

  export default ManageWallpaper;
  export { TYPE };
}
