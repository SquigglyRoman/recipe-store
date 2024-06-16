import axios from "axios";
import { Metadata, Recipe, RecipeFolder, RecipeFolderContents } from "./models";

export async function getAllRecipes(): Promise<Recipe[]> {
    const recipeFolders = await getAllRecipeFolders();
    return Promise.all(recipeFolders.map(fetchRecipeData));
}

async function fetchRecipeData(folder: RecipeFolder): Promise<Recipe> {
    const recipeFolderContents = await getFolderContents(folder);
    
    const metadataFile = findFile(recipeFolderContents, folder, 'metadata.json');
    const recipeFile = findFile(recipeFolderContents, folder, '.pdf')

    const metadataResponse = await axios.get<Metadata>(metadataFile.download_url);
    return {
        metadata: metadataResponse.data,
        fileUrl: recipeFile.download_url
    };
}

function findFile(recipeFolderContents: RecipeFolderContents[], folder: RecipeFolder, fileEndsWith: string) {
    const file = recipeFolderContents.find(file => file.name.endsWith(fileEndsWith));
    if (!file) {
        throw new Error(`No ${file} file found in folder ${folder.name}`);
    };
    return file;
}

async function getFolderContents(folder: RecipeFolder): Promise<RecipeFolderContents[]> {
    const recipeFolderContentsResponse = await axios.get<RecipeFolderContents[]>(folder.url);
    return recipeFolderContentsResponse.data;
}

async function getAllRecipeFolders(): Promise<RecipeFolder[]> {
    const recipesResponse = await axios.get<RecipeFolder[]>('https://api.github.com/repos/SquigglyRoman/recipe-store/contents/recipes');
    return recipesResponse.data;
}
