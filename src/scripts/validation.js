import { object, string } from 'yup';

const validateUrl = async (url, urlList) => {
    const shema = object({ url: string('not_string')
        .url('incorrect_url')
        .nullable()
        .notOneOf(urlList, 'duplicate_url') })
    await shema.validate({ url })
}

export default validateUrl