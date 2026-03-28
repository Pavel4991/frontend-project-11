import { proxy, subscribe, snapshot } from 'valtio/vanilla'

const createSectionCard = (title) => {
    const feedCard = document.createElement('div')
    feedCard.classList.add('card', 'border-0')

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    const cardTitle = document.createElement('h2')
    cardTitle.classList.add('card-title', 'h4')
    cardTitle.textContent = title

    const cardList = document.createElement('ul')
    cardList.classList.add('list-group', 'border-0', 'rounded-0')

    cardBody.append(cardTitle)
    feedCard.append(cardBody, cardList)

    return feedCard
}



export default (initState, i18n, input, submitButton, urlStateField, feeds, posts) => {
    const watchedState = proxy(initState)

    const renderFeeds = () => {
        const { data } = snapshot(watchedState)
        const currentFeeds = data.feeds
        
        feeds.innerHTML = ''
        const feedsSection = createSectionCard(i18n.t(`ui.feedsTitle`))
        const feedsList = feedsSection.querySelector('ul')

        currentFeeds.forEach(feed => {
            const feedItem = document.createElement('li')
            feedItem.classList.add('list-group-item', 'border-0', 'border-end-0')

            const feedItemTitle = document.createElement('h3')
            feedItemTitle.classList.add('h6', 'm-0')
            feedItemTitle.textContent = feed.feedTitle

            const feedItemDescription = document.createElement('p')
            feedItemDescription.classList.add('m-0', 'small', 'text-black-50')
            feedItemDescription.textContent = feed.feedDescription

            feedItem.append(feedItemTitle, feedItemDescription)

            feedsList.append(feedItem)
        })
        feeds.append(feedsSection)
    }

    const renderPosts = () => {
        const { data } = snapshot(watchedState)
        const currentPosts = data.posts

        posts.innerHTML = ''
        const postsSection = createSectionCard(i18n.t(`ui.postsTitle`))
        const postsList = postsSection.querySelector('ul')

        currentPosts.forEach(post => {
            const seenPostCheck = data.seenPosts.find(({ postId }) => postId === post.postId)

            const postItem = document.createElement('li')
            postItem.classList.add('list-group-item', 'border-0', 'border-end-0')
            postItem.classList.add('d-flex', 'justify-content-between', 'align-items-start')

            const postItemLink = document.createElement('a')
            seenPostCheck ? postItemLink.classList.add('fw-normal', 'link-secondary') : postItemLink.classList.add('fw-bold')
            postItemLink.setAttribute('href', `${post.postLink}`)
            postItemLink.setAttribute('target', '_blanck')
            postItemLink.setAttribute('data-id', `${post.postId}`)
            postItemLink.setAttribute('rel', 'noopener noreferrer')
            postItemLink.textContent = post.postTitle

            const postItemButton = document.createElement('button')
            postItemButton.classList.add('btn', 'btn-outline-primary', 'btn-sm')
            postItemButton.setAttribute('type', 'button')
            postItemButton.setAttribute('data-id', `${post.postId}`)
            postItemButton.setAttribute('data-bs-toggle', `modal`)
            postItemButton.setAttribute('data-bs-target', `#modal`)
            postItemButton.textContent = i18n.t('ui.postButton')

            postItem.append(postItemLink, postItemButton)
            postsList.append(postItem)
        })
        posts.append(postsSection)
    }

    const renderForm = () => {
        const { requestForm } = snapshot(watchedState).ui
        const validationError = requestForm.validationError
        const requestError = requestForm.requestProcess.error
        const requestState = requestForm.requestProcess.state

        switch (requestState) {
            case 'filling':
                break
            case 'processing':
                submitButton.setAttribute('disabled', true)
                break
            case 'failed_validation':
                submitButton.removeAttribute('disabled')
                input.classList.add('is-invalid')
                urlStateField.classList.add('text-danger')
                urlStateField.classList.remove('text-success')
                urlStateField.textContent = i18n.t(`validationError.${validationError}`)
                break
            case 'failed_request':
                submitButton.removeAttribute('disabled')
                input.classList.remove('is-invalid')
                urlStateField.classList.add('text-danger')
                urlStateField.textContent = i18n.t(`requestStatus.${requestError}`)
                break
            case 'success':
                submitButton.removeAttribute('disabled')
                input.classList.remove('is-invalid')
                input.value = ''
                input.focus()
                urlStateField.classList.remove('text-danger')
                urlStateField.classList.add('text-success')
                urlStateField.textContent = i18n.t(`requestStatus.succes_request`)
                break
        }
    }

    subscribe(watchedState.ui.requestForm, renderForm)
    subscribe(watchedState.data, renderFeeds)
    subscribe(watchedState.data, renderPosts)

    return watchedState
}