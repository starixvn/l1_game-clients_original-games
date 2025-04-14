import { getFilteredGames } from '../utils';
import { getGameSettingIds } from '../../_shared/app-settings';

// Mock getGameSettingIds
jest.mock('../../_shared/app-settings', () => ({
    getGameSettingIds: jest.fn()
}));

describe('getFilteredGames', () => {
    beforeEach(() => {
        // Reset mock before each test
        jest.clearAllMocks();
    });

    it('should return empty array when no offer games provided', () => {
        // Arrange
        (getGameSettingIds as jest.Mock).mockReturnValue([1, 2, 3]);
        const offerGames: { gameId: number }[] = [];

        // Act
        const result = getFilteredGames(offerGames);

        // Assert
        expect(result).toEqual([]);
    });

    it('should return empty array when no matching games found', () => {
        // Arrange
        (getGameSettingIds as jest.Mock).mockReturnValue([1, 2, 3]);
        const offerGames = [
            { gameId: 4 },
            { gameId: 5 }
        ];

        // Act
        const result = getFilteredGames(offerGames);

        // Assert
        expect(result).toEqual([]);
    });

    it('should return filtered games that match game setting IDs', () => {
        // Arrange
        (getGameSettingIds as jest.Mock).mockReturnValue([1, 2, 3, 4]);
        const offerGames = [
            { gameId: 1 },
            { gameId: 3 },
            { gameId: 5 }
        ];

        // Act
        const result = getFilteredGames(offerGames);

        // Assert
        expect(result).toEqual([
            { gameId: 1 },
            { gameId: 3 }
        ]);
    });

    it('should handle duplicate game IDs in offer games', () => {
        // Arrange
        (getGameSettingIds as jest.Mock).mockReturnValue([1, 2, 3]);
        const offerGames = [
            { gameId: 1 },
            { gameId: 1 },
            { gameId: 2 }
        ];

        // Act
        const result = getFilteredGames(offerGames);

        // Assert
        expect(result).toEqual([
            { gameId: 1 },
            { gameId: 2 }
        ]);
    });

    it('should return all games when all match game setting IDs', () => {
        // Arrange
        (getGameSettingIds as jest.Mock).mockReturnValue([1, 2, 3]);
        const offerGames = [
            { gameId: 1 },
            { gameId: 2 },
            { gameId: 3 }
        ];

        // Act
        const result = getFilteredGames(offerGames);

        // Assert
        expect(result).toEqual([
            { gameId: 1 },
            { gameId: 2 },
            { gameId: 3 }
        ]);
    });
}); 