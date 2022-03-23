
export const filterSys = (data) => {
  let newContentData = []
  data.items.forEach((item, i) => {
    newContentData[i] = {...data.items[i].fields, id: data.items[i].sys.id, type: data.items[i].sys.type}
  })
  return newContentData[0]
}

