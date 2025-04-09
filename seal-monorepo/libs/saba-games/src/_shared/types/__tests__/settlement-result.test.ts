import { choices } from '../settlement-result';

describe('settlement-result', () => {
    describe('choices', () => {
        it("should have correct keys and values", () => {
            expect(choices).toEqual({
              over: "over",
              under: "under",
              odd: "odd",
              even: "even",
              big: "big",
              small: "small",
            });
          });
    });
}); 