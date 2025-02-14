declare module 'dom-to-image-more'

declare module 'piexifjs' {
  export const load: (dataUrl: string) => any
  export const dump: (exifObj: any) => any
  export const insert: (exifBytes: any, dataUrl: string) => string
}

declare module 'lodash/cloneDeep'
declare module 'lodash/find'
declare module 'lodash/get'
declare module 'lodash/isEmpty'
declare module 'lodash/filter'
declare module 'lodash/map'