export function getAssetsFile(path) {
  const pathArr = path.split('/')
  switch (pathArr.length) {
    case 1:
      return new URL(`/src/assets/${path}`, import.meta.url).href
    case 2:
      return new URL(`/src/assets/${pathArr[0]}/${pathArr[1]}`, import.meta.url).href
    case 3:
      return new URL(`/src/assets/${pathArr[0]}/${pathArr[1]}/${pathArr[2]}`, import.meta.url).href
    case 4:
      return new URL(`/src/assets/${pathArr[0]}/${pathArr[1]}/${pathArr[2]}/${pathArr[3]}`, import.meta.url).href
    case 5:
      return new URL(
        `/src/assets/${pathArr[0]}/${pathArr[1]}/${pathArr[2]}/${pathArr[3]}/${pathArr[4]}`,
        import.meta.url
      ).href
    case 6:
      return new URL(
        `/src/assets/${pathArr[0]}/${pathArr[1]}/${pathArr[2]}/${pathArr[3]}/${pathArr[4]}/${pathArr[5]}`,
        import.meta.url
      ).href
    default:
      throw new Error('Invalid path')
  }
}
