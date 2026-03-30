import validateUrl from './validation'
import i18n from 'i18next'
import render from './view'
import resources from '../locales/index'
import makeRequest from './makeRequest'
import parser from './parser'
import _ from 'lodash'
import { proxySet } from 'valtio/vanilla/utils'
import * as bootstrap from 'bootstrap'

const runApp = async () => {
  const inputForm = document.querySelector('.rss-form')
  const submitButton = inputForm.querySelector('button[type="submit"]')
  const input = document.getElementById('url-input')
  const urlStateField = document.querySelector('.feedback')
  const feeds = document.querySelector('.feeds')
  const posts = document.querySelector('.posts')
  const modal = new bootstrap.Modal(document.getElementById('modal'))

  const renderElements = render(input, submitButton, urlStateField, feeds, posts, modal)

  const initialState = {
    ui: {
      appLocale: {
        lng: 'ru',
      },
      requestForm: {
        validationError: '',
        requestProcess: {
          state: 'filling',
          error: '',
        },
      },
      modalDialog: {
        activePost: '',
      },
      seenPosts: proxySet(),
    },
    data: {
      feeds: [],
      posts: [],
    },
  }

  const i18nextInstance = i18n.createInstance()
  await i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })

  const watchedState = renderElements(initialState, i18nextInstance)

  const repeatRequest = async (url, feedId) => {
    const requestTimeout = async (url) => {
      setTimeout(() => repeatRequest(url, feedId), 5000)
    }

    await makeRequest(url)
      .then(response => parser(response))
      .then((data) => {
        const posts = data.posts
        const currentPosts = watchedState.data.posts.map(post => post.postLink)
        currentPosts.map(post => post.postLink)
        const newPosts = posts.filter(({ postLink }) => !currentPosts.includes(postLink))
        newPosts.forEach((post) => {
          post.feedId = feedId
          post.postId = _.uniqueId('post_')
          return post
        })
        watchedState.data.posts = watchedState.data.posts.concat(newPosts)
      })
    requestTimeout(url)
  }

  inputForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)

    const url = formData.get('url').trim()

    watchedState.ui.requestForm.validationError = ''
    watchedState.ui.requestForm.requestProcess.state = 'processing'
    watchedState.ui.requestForm.requestProcess.error = ''

    const currentFeeds = watchedState.data.feeds.map(feed => feed.feedUrl)

    await validateUrl(url, currentFeeds)
      .then((validUrl) => {
        if (!validUrl) {
          return
        }
        watchedState.ui.requestForm.validationError = ''
        return makeRequest(validUrl)
      })
      .then((response) => {
        if (!response) {
          return
        }
        return parser(response, url)
      })
      .then((data) => {
        const feed = data.feed
        feed.feedId = _.uniqueId('feed_')
        watchedState.data.feeds = watchedState.data.feeds.concat(feed)
        const posts = data.posts.toReversed()
        posts.forEach((post) => {
          post.feedId = feed.feedId
          post.postId = _.uniqueId('post_')
          return post
        })
        watchedState.data.posts = watchedState.data.posts.concat(posts)
        watchedState.ui.requestForm.requestProcess.state = 'success'

        watchedState.data.feeds.forEach(feed => repeatRequest(feed.feedUrl, feed.feedId))
      })
      .catch((error) => {
        const validationErrors = ['duplicate_url', 'empty_url', 'incorrect_url']
        const requestErrors = ['network_error', 'parser_error']

        if (validationErrors.includes(error.message)) {
          watchedState.ui.requestForm.validationError = error.message
          watchedState.ui.requestForm.requestProcess.state = 'failed_validation'
        }
        if (requestErrors.includes(error.message)) {
          watchedState.ui.requestForm.requestProcess.error = error.message
          watchedState.ui.requestForm.requestProcess.state = 'failed_request'
        }
      })
  })

  posts.addEventListener('click', (event) => {
    const target = event.target
    const postId = target.dataset.id
    if (postId) {
      watchedState.ui.seenPosts = watchedState.ui.seenPosts.add(postId)
      watchedState.ui.modalDialog.activePost = postId
    } 
    else { 
      return 
    }
  })
}

export default runApp
