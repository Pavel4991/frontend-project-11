import validateUrl from "./validation"
import i18n from 'i18next'
import render from './view'
import resources from '../locales/index'
import makeRequest from "./makeRequest"
import parser from "./parser"

const runApp = async () => {
    const inputForm = document.querySelector('.rss-form')
    const submitButton = inputForm.querySelector('button[type="submit"]')
    const input = document.getElementById('url-input')
    const urlStateField = document.querySelector('.feedback')
    const feeds = document.getElementById('feeds')
    const posts = document.getElementById('posts')
    const modal = document.getElementById('modal')

    const renderElements = render(input, submitButton, urlStateField, feeds, posts, modal)

    const initialState = {
        ui: {
            appLocale:{ 
                lng: 'ru'
            },
            requestForm:{
                validationError: '',
                requestProcess: {
                    state: 'filling',
                    error: '',
                }
            },
            modalDialog: {
                activePost: ''
            }
        },
        data: {
            feeds: [],
            posts: [],
            seenPosts: []
        }
    }

    const i18nextInstance = i18n.createInstance()
    await i18nextInstance.init({
        lng: 'ru',
        debug: false,
        resources
    })

    const watchedState = renderElements(initialState, i18nextInstance)

    inputForm.addEventListener('submit', async (event) => {
        event.preventDefault()

        const formData = new FormData(event.target)

        const url = formData.get('url').trim()

        watchedState.ui.requestForm.validationError = ''
        watchedState.ui.requestForm.requestProcess.state = 'processing'
        watchedState.ui.requestForm.requestProcess.error = ''

        const currentFeeds = watchedState.data.feeds.map(feed => feed.feedUrl)
        
        

        await validateUrl(url, currentFeeds)
            .then(validUrl => {
                if(!validUrl) {
                    return
                }
                watchedState.ui.requestForm.validationError = ''
                return makeRequest(validUrl)
            })
            .then(response => {
                if (!response) {
                    return
                }
                return parser(response, url)
            })
            .then(data => {
                if (!data) {
                    return
                }
                watchedState.data.feeds = watchedState.data.feeds.concat(data.feed)
                watchedState.data.posts = watchedState.data.posts.concat(data.posts)
                watchedState.ui.requestForm.requestProcess.state = 'success'

            })
            .catch(error => {
                const validationErrors = ['duplicate_url', 'empty_url', 'incorrect_url']
                const requestErrors = ['network_error', 'parser_error']
                console.log(error.message)

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
            watchedState.data.seenPosts = watchedState.data.seenPosts.concat({ postId })
            watchedState.ui.modalDialog.activePost = postId
        } else {
            return
        }
    })

}


export default runApp
