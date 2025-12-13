declare module "exif-parser" {
  export interface ExifParser {
    parse(): {
      tags: { [key: string]: any };
      imageSize: { width: number; height: number };
      thumbnailOffset: number;
      thumbnailLength: number;
      thumbnailType: number;
      app1Offset: number;
    };
  }

  export function create(buffer: ArrayBuffer | Buffer): ExifParser;
}
