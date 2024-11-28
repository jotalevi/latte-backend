import * as fs from 'fs';
import RequestParams from './RequestParams';
import FileMap from './FileMap';

export default class ScrapeCache {
  static fileMap: FileMap[] = [];
  static filePrefix = './src/utils/ScrapeCache/';

  static init() {
    try {
      let file = fs.readFileSync(`${this.filePrefix}filemap.json`, 'utf8');
      for (const item of JSON.parse(file).maps) {
        this.fileMap.push(item as FileMap);
      }
    } catch {
      fs.writeFileSync(
        `${this.filePrefix}filemap.json`,
        JSON.stringify({ maps: [] }),
      );
      this.init();
    }
  }

  static updateFileMap() {
    fs.writeFileSync(
      `${this.filePrefix}filemap.json`,
      JSON.stringify({ maps: this.fileMap }),
    );
  }

  static cache(
    requestName: string,
    requestParams: RequestParams[],
    cacheData: any,
  ) {
    for (const fileMap of this.fileMap) {
      if (
        fileMap.requestName === requestName &&
        JSON.stringify(fileMap.requestParams) === JSON.stringify(requestParams)
      ) {
        fileMap.cacheData = JSON.stringify(cacheData);
        ScrapeCache.updateFileMap();
        return;
      }
    }

    this.fileMap.push({
      requestName: requestName,
      requestParams: requestParams,
      cacheData: JSON.stringify(cacheData),
    });

    ScrapeCache.updateFileMap();
  }

  static get(
    requestName: string,
    requestParams: RequestParams[],
  ): Object | boolean {
    for (const item of this.fileMap) {
      if (
        item.requestName === requestName &&
        JSON.stringify(item.requestParams) === JSON.stringify(requestParams)
      ) {
        return JSON.parse(item.cacheData.toString());
      }
    }

    return false;
  }
}
