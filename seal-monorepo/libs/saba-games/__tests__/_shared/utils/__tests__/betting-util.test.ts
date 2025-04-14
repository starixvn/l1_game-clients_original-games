import { checkValidAmount, parseInputValue, WarnMsgType } from '../betting-util';

describe('betting-util', () => {
    describe('checkValidAmount', () => {
        it('should return NOT_NUMBER when amount is NaN', () => {
            // Arrange
            const amount = NaN;
            const min = 10;
            const max = 100;

            // Act
            const result = checkValidAmount(amount, min, max);

            // Assert
            expect(result).toEqual({
                newAmount: min,
                msg: WarnMsgType.NOT_NUMBER
            });
        });

        it('should return LESS_THAN_MIN when amount is less than min', () => {
            // Arrange
            const amount = 5;
            const min = 10;
            const max = 100;

            // Act
            const result = checkValidAmount(amount, min, max);

            // Assert
            expect(result).toEqual({
                newAmount: min,
                msg: WarnMsgType.LESS_THAN_MIN
            });
        });

        it('should return MORE_THAN_MAX when amount is more than max', () => {
            // Arrange
            const amount = 150;
            const min = 10;
            const max = 100;

            // Act
            const result = checkValidAmount(amount, min, max);

            // Assert
            expect(result).toEqual({
                newAmount: max,
                msg: WarnMsgType.MORE_THAN_MAX
            });
        });

        it('should return valid amount when amount is within range', () => {
            // Arrange
            const amount = 50;
            const min = 10;
            const max = 100;

            // Act
            const result = checkValidAmount(amount, min, max);

            // Assert
            expect(result).toEqual({
                newAmount: amount,
                msg: ''
            });
        });

        it('should handle amount equal to min', () => {
            // Arrange
            const amount = 10;
            const min = 10;
            const max = 100;

            // Act
            const result = checkValidAmount(amount, min, max);

            // Assert
            expect(result).toEqual({
                newAmount: amount,
                msg: ''
            });
        });

        it('should handle amount equal to max', () => {
            // Arrange
            const amount = 100;
            const min = 10;
            const max = 100;

            // Act
            const result = checkValidAmount(amount, min, max);

            // Assert
            expect(result).toEqual({
                newAmount: amount,
                msg: ''
            });
        });
    });

    describe('parseInputValue', () => {
        it('should parse numeric string to number', () => {
            // Arrange
            const input = '123';

            // Act
            const result = parseInputValue(input);

            // Assert
            expect(result).toBe(123);
        });

        it('should remove non-numeric characters from input', () => {
            // Arrange
            const input = '1a2b3c';

            // Act
            const result = parseInputValue(input);

            // Assert
            expect(result).toBe(123);
        });

        it('should return 0 for empty string', () => {
            // Arrange
            const input = '';

            // Act
            const result = parseInputValue(input);

            // Assert
            expect(result).toBe(0);
        });

        it('should return 0 for string with only non-numeric characters', () => {
            // Arrange
            const input = 'abc';

            // Act
            const result = parseInputValue(input);

            // Assert
            expect(result).toBe(0);
        });

        it('should handle decimal numbers by removing decimal point', () => {
            // Arrange
            const input = '12.34';

            // Act
            const result = parseInputValue(input);

            // Assert
            expect(result).toBe(1234);
        });

        it('should handle negative numbers by removing minus sign', () => {
            // Arrange
            const input = '-123';

            // Act
            const result = parseInputValue(input);

            // Assert
            expect(result).toBe(123);
        });
    });
}); 