import { proxy, subscribe, snapshot } from 'valtio/vanilla'

const createSection = (title) => {
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



const render = (input, submitButton, urlStateField, feeds, posts, modal) => (initState, i18n) => {
    const watchedState = proxy(initState)

    const renderForm = () => {
        const { requestForm } = snapshot(watchedState).ui
        const validationError = requestForm.validationError
        const requestError = requestForm.requestProcess.error
        const requestState = requestForm.requestProcess.state

        switch (requestState) {
            case 'filling':
                break
            case 'processing':
                input.setAttribute('disabled', true)
                submitButton.setAttribute('disabled', true)
                break
            case 'failed_validation':
                submitButton.removeAttribute('disabled')
                input.classList.add('is-invalid')
                input.removeAttribute('disabled')
                input.focus()
                urlStateField.classList.add('text-danger')
                urlStateField.classList.remove('text-success')
                urlStateField.textContent = i18n.t(`validationError.${validationError}`)
                break
            case 'failed_request':
                submitButton.removeAttribute('disabled')
                input.classList.remove('is-invalid')
                input.removeAttribute('disabled')
                input.focus()
                urlStateField.classList.add('text-danger')
                urlStateField.textContent = i18n.t(`requestStatus.${requestError}`)
                break
            case 'success':
                submitButton.removeAttribute('disabled')
                input.classList.remove('is-invalid')
                input.removeAttribute('disabled')
                input.value = ''
                input.focus()
                urlStateField.classList.remove('text-danger')
                urlStateField.classList.add('text-success')
                urlStateField.textContent = i18n.t(`requestStatus.succes_request`)
                break
        }
    }

    const renderFeeds = () => {
        const { data } = snapshot(watchedState)
        const currentFeeds = data.feeds
        
        feeds.innerHTML = ''
        const feedsSection = createSection(i18n.t(`ui.feedsTitle`))

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
        const { ui, data } = snapshot(watchedState)
        const currentPosts = data.posts
        
        posts.innerHTML = ''
        const postsSection = createSection(i18n.t(`ui.postsTitle`))
        const postsList = postsSection.querySelector('ul')

        currentPosts.forEach(post => {
            const seenPostCheck = ui.seenPosts.has(post.postId)

            const postItem = document.createElement('li')
            postItem.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start')

            const postItemLink = document.createElement('a')
            seenPostCheck ? postItemLink.classList.add('fw-normal', 'link-secondary') : postItemLink.classList.add('fw-bold')
            postItemLink.setAttribute('href', `${post.postLink}`)
            postItemLink.setAttribute('target', '_blanck')
            postItemLink.dataset.id = post.postId
            postItemLink.setAttribute('rel', 'noopener noreferrer')
            postItemLink.textContent = post.postTitle

            const postItemButton = document.createElement('button')
            postItemButton.classList.add('btn', 'btn-outline-primary', 'btn-sm')
            postItemButton.setAttribute('type', 'button')
            postItemButton.dataset.id = post.postId
            postItemButton.dataset.bsToggle = 'modal'
            postItemButton.dataset.bsTarget = '#modal'
            postItemButton.textContent = i18n.t('ui.postButton')

            postItem.append(postItemLink, postItemButton)
            postsList.prepend(postItem)
        })
        posts.append(postsSection)
    }

    const renderModal = () => {
        const { modalDialog } = snapshot(watchedState).ui
        const activePost = watchedState.data.posts.find(post => post.postId === modalDialog.activePost)

        const modalTitle = modal._dialog.querySelector('.modal-title')
        const modalDescription = modal._dialog.querySelector('.modal-body')
        const detailsButton = modal._dialog.querySelector('#modal-details-btn')
        const closeButton = modal._dialog.querySelector('#modal-close-btn')

        detailsButton.setAttribute('href', activePost.postLink)

        modalTitle.textContent = activePost.postTitle
        modalDescription.textContent = 'Цель: Научиться извлекать из дерева необходимые данные'
        detailsButton.textContent = i18n.t('ui.modal.detailsButton')
        closeButton.textContent = i18n.t('ui.modal.closeButton')
    }

    subscribe(watchedState.ui.requestForm, renderForm)
    subscribe(watchedState.data, renderFeeds)
    subscribe(watchedState.data, renderPosts)
    subscribe(watchedState.ui.seenPosts, renderPosts)
    subscribe(watchedState.ui.modalDialog, renderModal)

    return watchedState
}

export default render