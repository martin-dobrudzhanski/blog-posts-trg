export const getCompressedImage = (url, { width, height }) => {
  const isContentfulLink = url.includes('images.ctfassets.net')
  const contentfulBegin = '?fm=jpg'
  const progressiveJPG = '&fl=progressive'
  const quality = '&q=90'
  const widthString = width ? `&w=${width}` : ``
  const heightString = height ? `&h=${height}` : ''
  const showSizeString = widthString || heightString
  const sizeString = showSizeString ? `${widthString}${heightString}&fit=scale` : ''
  const compressString = `${contentfulBegin}${progressiveJPG}${sizeString}${quality}`

  if (isContentfulLink) {
    return `${url}${compressString}`
  } else {
    return url
  }
}
