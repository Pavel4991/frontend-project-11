import _ from 'lodash'

const textContentParser = (node, nodeType = 'feed') => {
    const nodeTitle = node.querySelector('title').textContent
    const nodeDescription = node.querySelector('description').textContent

    if (nodeType === 'feed') {
        const feedId = _.uniqueId('feed_')
        return { 
            feedId, 
            feedTitle: nodeTitle, 
            feedDescription: nodeDescription 
        }
    } 
    if (nodeType === 'post') {
        const postId = _.uniqueId('post_')
        const postLink = node.querySelector('link').textContent
        return { 
            postId,
            postLink, 
            postTitle: nodeTitle, 
            postDescription: nodeDescription 
        }
    }
}

export default (response, url) => {
    const parser = new DOMParser()
    const parsedData = parser.parseFromString(response.data.contents, 'application/xml')
    const parseError = parsedData.querySelector('parsererror')
    
    if (parseError) {
        throw new Error('parser_error')
    }

    const feed = textContentParser(parsedData)
    feed.feedUrl = url
    const items = Array.from(parsedData.querySelectorAll('item'))
    const posts = items.map(node => {
        const post = textContentParser(node, 'post')
        post.feedId = feed.feedId
        return post
    })

    return { feed, posts }
}
