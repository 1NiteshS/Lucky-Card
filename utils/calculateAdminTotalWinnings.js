import Game from '../models/gameModel.js';
import SelectedCard from '../models/selectedCardModel.js';

export const calculateAdminTotalWinnings = async (adminId) => {
    try {
        // Fetch all games
        const games = await Game.find({ 'Bets.adminID': adminId });

        let totalWinnings = 0;

        // Process each game
        for (const game of games) {
            // Fetch the selected (winning) card for this game
            const selectedCard = await SelectedCard.findOne({ gameId: game.GameId });
            if (!selectedCard) continue;

            const winningCardNo = selectedCard.cardId;
            const winningMultiplier = parseInt(selectedCard.multiplier);

            // Find the admin's bet in this game
            const adminBet = game.Bets.find(bet => bet.adminID === adminId);
            if (!adminBet) continue;

            // Find the winning card in this bet
            const winningBet = adminBet.card.find(card => card.cardNo === winningCardNo);

            if (winningBet) {
                const winAmount = winningBet.Amount * winningMultiplier;
                totalWinnings += winAmount;
            }
        }

        return totalWinnings;

    } catch (error) {
        console.error('Error calculating admin total winnings:', error);
        throw error;
    }
};