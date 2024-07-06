import { matches } from "./filter";
import { Metadata, Recipe } from "./models";

type TestCase = {
    recipeName: string;
    recipeTags: string[];
    searchTokens: string[];
    selectedTags: string[];
    isMatched: boolean;
};

const testCases: TestCase[] = [
    {
        recipeName: "Recipe 1",
        recipeTags: ["tag1", "tag2"],
        searchTokens: [],
        selectedTags: [],
        isMatched: true
    },
    {
        recipeName: "Recipe 1",
        recipeTags: ["tag1", "tag2"],
        searchTokens: [],
        selectedTags: ["tag1"],
        isMatched: true
    },
    {
        recipeName: "Recipe 1",
        recipeTags: ["tag1", "tag2"],
        searchTokens: [],
        selectedTags: ["tag3"],
        isMatched: false
    },
    {
        recipeName: "Recipe 1",
        recipeTags: ["tag1", "tag2"],
        searchTokens: [],
        selectedTags: ["tag"],
        isMatched: false
    },
    {
        recipeName: "Gnocchi",
        recipeTags: ["Vegan", "Kartoffeln"],
        searchTokens: ["Gnoc"],
        selectedTags: [],
        isMatched: true
    },
    {
        recipeName: "Gnocchi",
        recipeTags: ["Vegan", "Kartoffeln"],
        searchTokens: ["Gnoc"],
        selectedTags: ["Vegan"],
        isMatched: true
    },
    {
        recipeName: "Gnocchi",
        recipeTags: ["Vegan", "Kartoffeln"],
        searchTokens: ["Gnoc"],
        selectedTags: ["FLOISCH"],
        isMatched: false
    },
    {
        recipeName: "Gnocchi",
        recipeTags: ["Vegan", "Kartoffeln"],
        searchTokens: ["Gnoc"],
        selectedTags: ["Vegan", "FLOISCH"],
        isMatched: false
    },
    {
        recipeName: "Recipe 1",
        recipeTags: ["tag1", "tag2"],
        searchTokens: ["recipe", "tag2"],
        selectedTags: [],
        isMatched: true
    },
    {
        recipeName: "Recipe 1",
        recipeTags: ["tag1", "tag2"],
        searchTokens: ["recipe", "tag2", "tag3"],
        selectedTags: [],
        isMatched: false
    },
    {
        recipeName: "Recipe 1",
        recipeTags: ["tag1", "tag2"],
        searchTokens: ["tag3"],
        selectedTags: [],
        isMatched: false
    },
];

it.each(testCases)("should match if search tokens are %p", ({ recipeName, recipeTags, searchTokens, selectedTags, isMatched }) => {
    const metadata: Metadata = {
        name: recipeName,
        tags: recipeTags
    }
    const result = matches(metadata, searchTokens, selectedTags);
    expect(result).toBe(isMatched);
});
