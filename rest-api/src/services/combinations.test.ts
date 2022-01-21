import assert from 'assert';
import combinations from './combinations';

describe("combinations", () => {
    it("combinations of size 0 of empty array should return trivially", () => {
        assert.deepEqual(
            combinations([], 0),
            []
        );
    })

    it("combinations of size POSITIVE of empty array should return trivially", () => {
        assert.deepEqual(
            combinations([], 213),
            []
        );
    })

    it("combinations of size 0 of non-empty array should return trivially", () => {
        assert.deepEqual(
            combinations([1, 2, 3, 4], 0),
            []
        );
    })

    it("combinations of size 1 should return correctly", () => {
        const elements = [5, 2, 8, 2];
        assert.deepEqual(
            combinations(elements, 1),
            elements.map(element => [element]))
    })

    it("combinations of size 4 of array of size 4 should return correctly", () => {
        const elements = [5, 2, 8, 2];
        assert.deepEqual(
            combinations(elements, 4),
            [elements])
    })

    it("specific case should return correctly", () => {
        const elements = [7, 1, 3, 6];
        assert.deepEqual(
            combinations(elements, 2),
            [[7, 1], [7, 3], [7, 6], [1, 3], [1, 6], [3, 6]])
    })
})