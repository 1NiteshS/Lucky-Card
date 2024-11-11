import Game from '../models/gameModel.js';
import SelectedCard from '../models/selectedCardModel.js';

export const distributeWinnings = async (gameId) => {
    try {
        // Fetch the game data
        const game = await Game.findOne({ GameId: gameId });
        if (!game) {
            throw new Error('Game not found');
        }

        // Fetch the selected (winning) card for this game
        const selectedCard = await SelectedCard.findOne({ gameId: gameId });
        if (!selectedCard) {
            throw new Error('Selected card not found for this game');
        }

        const winningCardNo = selectedCard.cardId;
        const winningMultiplier = parseInt(selectedCard.multiplier);

        // Initialize an object to store each admin's winnings
        const adminWinnings = {};

        // Process each bet in the game
        game.Bets.forEach(bet => {
            const adminId = bet.adminID;

            // Find the winning card in this bet
            const winningBet = bet.card.find(card => card.cardNo === winningCardNo);

            if (winningBet) {
                const winAmount = winningBet.Amount * winningMultiplier;

                // Add to admin's winnings
                if (adminWinnings[adminId]) {
                    adminWinnings[adminId] += winAmount;
                } else {
                    adminWinnings[adminId] = winAmount;
                }
            }
        });

        return {
            gameId: gameId,
            winningCard: winningCardNo,
            multiplier: winningMultiplier,
            adminWinnings: adminWinnings
        };

    } catch (error) {
        console.error('Error distributing winnings:', error);
        throw error;
    }
};