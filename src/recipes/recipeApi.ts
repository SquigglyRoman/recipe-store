import { Octokit } from "octokit";
import { Metadata, Recipe, RecipeFolder, RecipeFolderContents } from "./models";

let octokit: Octokit;

export async function getAllRecipes(apiToken: string): Promise<Recipe[]> {
    octokit = new Octokit({ auth: apiToken });
    const recipeFolders = await getAllRecipeFolders();
    return Promise.all(recipeFolders.map(fetchRecipeData));
}

async function fetchRecipeData(folder: RecipeFolder): Promise<Recipe> {
    const recipeFolderContents = await getFolderContents(folder);

    const metadata = await fetchMetadata(recipeFolderContents, folder);
    const recipeFile = findCriticalFile(recipeFolderContents, folder, '.pdf')
    const imageFile = findFile(recipeFolderContents, '.jpg', '.jpeg', '.png')

    return {
        metadata,
        fileUrl: recipeFile.download_url,
        imageUrl: imageFile?.download_url
    };
}

async function fetchMetadata(recipeFolderContents: RecipeFolderContents[], folder: RecipeFolder): Promise<Metadata> {
    const metadataFile = findCriticalFile(recipeFolderContents, folder, 'metadata.json');
    const metadataResponse = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "SquigglyRoman",
        repo: "recipe-store",
        path: metadataFile.path
    });
    return JSON.parse(atob(metadataResponse.data.content)) as Metadata;
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
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "SquigglyRoman",
        repo: "recipe-store",
        path: folder.path
    });
    return response.data;
}

async function getAllRecipeFolders(): Promise<RecipeFolder[]> {
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "SquigglyRoman",
        repo: "recipe-store",
        path: "recipes"
    });
    return response.data;
}
