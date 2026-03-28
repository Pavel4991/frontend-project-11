import { object, string, setLocale } from 'yup';

const validateUrl = async (url, feeds) => {
    setLocale({
        mixed: {
            notOneOf: 'duplicate_url',
            required: 'empty_url',
        },
        string: {
            url: 'incorrect_url',
        },
    });

    let schema = object().shape({ 
        url: string()
            .url()
            .required()
            .notOneOf(feeds) 
    });

    try {
        await schema.validate({ url })
        return url
    } catch (error) {
        throw error
    }
}

export default validateUrl