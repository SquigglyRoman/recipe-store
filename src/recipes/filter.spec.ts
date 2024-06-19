import { isMatchedByAnySearchToken } from "./filter";
import { Recipe } from "./models";

describe("isMatchedByAnySearchToken", () => {
    it("should return true if searchTokens is empty", () => {
        const searchTokens: string[] = [];
        const recipe: Recipe = {
            metadata: {
                name: "Recipe 1",
                tags: ["tag1", "tag2"],
            },
            fileUrl: "",
        };

        const result = isMatchedByAnySearchToken(searchTokens, recipe);

        expect(result).toBe(true);
    });

    it("should return true when partially matching", () => {
        const searchTokens: string[] = ["Gnoc"];
        const recipe: Recipe = {
            metadata: {
                name: "Gnocchi",
                tags: ["Vegan", "Kartoffeln"],
            },
            fileUrl: "",
        };

        const result = isMatchedByAnySearchToken(searchTokens, recipe);

        expect(result).toBe(true);
    });

    it("should return true if all search tokens are found in recipe metadata", () => {
        const searchTokens: string[] = ["recipe", "tag2"];
        const recipe: Recipe = {
            metadata: {
                name: "Recipe 1",
                tags: ["tag1", "tag2"],
            },
            fileUrl: "",
        };

        const result = isMatchedByAnySearchToken(searchTokens, recipe);

        expect(result).toBe(true);
    });

    it("should return false if not all search tokens are found in recipe metadata", () => {
        const searchTokens: string[] = ["recipe", "tag2", "tag3"];
        const recipe: Recipe = {
            metadata: {
                name: "Recipe 1",
                tags: ["tag1", "tag2"],
            },
            fileUrl: "",
        };

        const result = isMatchedByAnySearchToken(searchTokens, recipe);

        expect(result).toBe(false);
    });

    it("should return false if no search token is found in recipe metadata", () => {
        const searchTokens: string[] = ["tag3"];
        const recipe: Recipe = {
            metadata: {
                name: "Recipe 1",
                tags: ["tag1", "tag2"],
            },
            fileUrl: "",
        };

        const result = isMatchedByAnySearchToken(searchTokens, recipe);

        expect(result).toBe(false);
    });
});