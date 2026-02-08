import onChange from 'on-change'

export default (state, input, urlStateField, i18n) => {

    const updateUI = async () => {
        const currentError = state.UI.error

        if (currentError !== '') {
            input.classList.add('is-invalid')
            urlStateField.textContent = i18n.t(`${currentError}`)
        } else {
            input.classList.remove('is-invalid')
            currentError = ''
        }

    }

    const watchedState  = onChange(state, updateUI)
    return watchedState
}



