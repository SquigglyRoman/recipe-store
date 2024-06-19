import axios from "axios";
import { Metadata, Recipe, RecipeFolder, RecipeFolderContents } from "./models";

export async function getAllRecipes(): Promise<Recipe[]> {
    const recipeFolders = await getAllRecipeFolders();
    return Promise.all(recipeFolders.map(fetchRecipeData));
}

async function fetchRecipeData(folder: RecipeFolder): Promise<Recipe> {
    const recipeFolderContents = await getFolderContents(folder);

    const metadataFile = findCriticalFile(recipeFolderContents, folder, 'metadata.json');
    const recipeFile = findCriticalFile(recipeFolderContents, folder, '.pdf')
    const imageFile = findFile(recipeFolderContents, '.jpg', '.jpeg', '.png')

    const metadataResponse = await axios.get<Metadata>(metadataFile.download_url);
    return {
        metadata: metadataResponse.data,
        fileUrl: recipeFile.download_url,
        imageUrl: imageFile?.download_url
    };
}

function findCriticalFile(recipeFolderContents: RecipeFolderContents[], folder: RecipeFolder, ...fileEndings: string[]): RecipeFolderContents {
    const file = findFile(recipeFolderContents, ...fileEndings);
    if (!file) {
        throw new Error(`No file with endings ${fileEndings.join(", ")} found in folder ${folder.name}`);
    }
    return file;
}

function findFile(recipeFolderContents: RecipeFolderContents[], ...fileEndings: string[]): RecipeFolderContents | undefined {
    const lowercaseFileEndings = fileEndings.map(ending => ending.toLowerCase());
    return recipeFolderContents.find(file => lowercaseFileEndings.some(ending => file.name.endsWith(ending.toLowerCase())));
}


async function getFolderContents(folder: RecipeFolder): Promise<RecipeFolderContents[]> {
    const recipeFolderContentsResponse = await axios.get<RecipeFolderContents[]>(folder.url);
    return recipeFolderContentsResponse.data;
}

async function getAllRecipeFolders(): Promise<RecipeFolder[]> {
    const recipesResponse = await axios.get<RecipeFolder[]>('https://api.github.com/repos/SquigglyRoman/recipe-store/contents/recipes');
    return recipesResponse.data;
}
