const textContentParser = (node, nodeType = 'feed') => {
  const nodeTitle = node.querySelector('title').textContent
  const nodeDescription = node.querySelector('description').textContent

  if (nodeType === 'feed') {
    return {
      feedTitle: nodeTitle,
      feedDescription: nodeDescription,
    }
  }
  if (nodeType === 'post') {
    const postLink = node.querySelector('link').textContent
    return {
      postLink,
      postTitle: nodeTitle,
      postDescription: nodeDescription,
    }
  }
}

const parser = (response, url) => {
  const parser = new DOMParser()
  const parsedData = parser.parseFromString(response.data.contents, 'application/xml')
  const parseError = parsedData.querySelector('parsererror')

  if (parseError) {
    throw new Error('parser_error')
  }

  const feed = textContentParser(parsedData)
  feed.feedUrl = url
  const items = Array.from(parsedData.querySelectorAll('item'))
  const posts = items.map(node => textContentParser(node, 'post'))

  return { feed, posts }
}

export default parser
