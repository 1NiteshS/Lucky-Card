// const searchTicket = require("./cardController");

import { searchTickets } from "./cardController.js";


export const searchAll = async (req, res) => {
    const searchTerm = req.query.q;  // Extract the search term (query parameter)

    try {
        // Perform search using searchTickets from cardController.js
        const ticketResult = await searchTickets(searchTerm);

        if (!ticketResult) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Return only the ticket result
        res.json({ result: ticketResult });
    } catch (error) {
        // Log the error and return a 500 response with an error message
        console.error("Error searching:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};