import Game from '../models/gameModel.js';
import SelectedCard from '../models/selectedCardModel.js';

export const calculateSingleAdminWinnings = async (adminId) => {
    try {
        // Fetch all games where this admin placed a bet
        const games = await Game.find({ 'Bets.adminID': adminId });

        // Fetch all selected cards
        const selectedCards = await SelectedCard.find();

        // Create a map of game ID to selected card for quick lookup
        const selectedCardMap = selectedCards.reduce((map, card) => {
            map[card.gameId] = card;
            return map;
        }, {});

        // Initialize result object
        const adminWinnings = {
            totalWinAmount: 0,
            games: []
        };

        // Process each game
        for (const game of games) {
            const selectedCard = selectedCardMap[game.GameId];
            if (!selectedCard) continue;

            const winningCardNo = selectedCard.cardId;
            const winningMultiplier = parseInt(selectedCard.multiplier);

            // Find this admin's bet in the game
            const adminBet = game.Bets.find(bet => bet.adminID === adminId);
            if (!adminBet) continue;

            // Find the winning card in this bet
            const winningBet = adminBet.card.find(card => card.cardNo === winningCardNo);

            if (winningBet) {
                const winAmount = winningBet.Amount * winningMultiplier;

                // Update admin's total win amount
                adminWinnings.totalWinAmount += winAmount;

                // Add game details to admin's games array
                adminWinnings.games.push({
                    gameId: game.GameId,
                    winningCard: winningCardNo,
                    winAmount: winAmount
                });
            }
        }

        return adminWinnings;
    } catch (error) {
        console.error('Error calculating admin winnings:', error);
        throw error;
    }
};