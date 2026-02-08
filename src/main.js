import axios from "axios"
import validateUrl from "./scripts/validation"
import i18n from 'i18next'
import render from './scripts/view'
import resources from './locales/index'

const inputForm = document.querySelector('.rss-form')
const input = document.getElementById('url-input')
const urlStateField = document.querySelector('.feedback')

const state = {
    UI: {
        appLocale: 'ru',
        error: '',
        seenPosts: []
    },
    requestProcess: {
        state: '',
        error: '',
    },
    data: {
        feeds: ['https://lorem-rss.hexlet.app/feed'],
        posts: [],
    }
}

const i18nextInstance = i18n.createInstance()
await i18nextInstance.init({
    lng: `${state.UI.appLocale}`,
    debug: true,
    resources
})



const watchedState = render(state, input, urlStateField, i18nextInstance)


// ... CONTOROLLER ...
inputForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const url = formData.get('url')
    validateUrl(url, watchedState.data.feeds)
        .catch(er => watchedState.UI.error = er.message)
        
})
