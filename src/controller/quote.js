const knex = require("../database/connection");

const registerQuote = async (req, res) => {
    const { user } = req;

    const { quote } = req.body;

    try {
        const localizeUser = await knex('users').where({ id: user.id }).first();

        if (!localizeUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (quote.length < 6) {
            return res.status(400).json({ message: "Quote must be more than 6 characters" });
        }

        const addQuote = await knex('thoughts').insert({
            id_quote: user.id,
            quote,
            likes: 0
        })

        return res.status(201).json({ message: 'Quote is registered successfully!' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' + error.message });
    }
}

const editQuote = async (req, res) => {
    const { user } = req;

    const { id } = req.params;

    const { quote } = req.body;

    try {
        const localizeUser = await knex('users').where({ id: user.id }).first();

        const localizeQuote = await knex('thoughts').where({ id }).first();

        if (!localizeQuote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        if (localizeUser.id !== localizeQuote.id_quote) {
            return res.status(404).json({ message: 'You can´t edit another users quote' })
        }

        const updateQuote = await knex('thoughts').update({ quote }).where({ id });

        return res.status(200).json({ message: 'Quote uptaded successfully!' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' + error.message });
    }
}

const viewQuote = async (req, res) => {
    try {
        const viewQuote = await knex('thoughts').orderBy('quote_date');

        return res.status(200).json(viewQuote)

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' + error.message });
    }
}

const deleteQuote = async (req, res) => {
    const { user } = req;

    const { id } = req.params;

    try {
        const localizeUser = await knex('users').where({ id: user.id }).first();

        const localizeQuote = await knex('thoughts').where({ id }).first();

        if (!localizeQuote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        if (localizeUser.id !== localizeQuote.id_quote) {
            return res.status(404).json({ message: 'You can´t delete another users quote' })
        }

        await knex('thoughts').where({ id }).del();

        return res.status(200).json({ message: 'Quote deleted successfully!' })

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' + error.message });
    }
}

const likeQuote = async (req, res) => {
    const { likes } = req;

    const { id } = req.params;

    try {
        const localizeQuote = await knex('thoughts').where({ id }).first();

        if (!localizeQuote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        let quoteLikes = localizeQuote.likes;

        const addLike = await knex('thoughts').update({ likes: quoteLikes + 1 }).where({ id });

        return res.status(200).json({message: 'Liked!'})

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' + error.message });
    }
}

const dislikeQuote = async(req,res) => {
    const { likes } = req;

    const { id } = req.params;

    try {
        const localizeQuote = await knex('thoughts').where({ id }).first();

        if (!localizeQuote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        let quoteLikes = localizeQuote.likes;

        const addLike = await knex('thoughts').update({ likes: quoteLikes - 1 }).where({ id });

        return res.status(200).json({message: 'Disliked!'})

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' + error.message });
    }
}

module.exports = {
    registerQuote,
    editQuote,
    viewQuote,
    deleteQuote,
    likeQuote,
    dislikeQuote
}