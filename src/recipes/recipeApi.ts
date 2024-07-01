import { Octokit } from "octokit";
import { Metadata, Recipe, RecipeFolder, RecipeFolderContents } from "./models";
import { createHash } from "crypto";

let octokit: Octokit;

export async function isAuthorized(apiToken: string): Promise<boolean> {
    initApi(apiToken);
    try {
        await octokit.request("GET /user");
        return true;
    } catch (error) {
        return false;
    }
}

function initApi(apiToken: string) {
    octokit = new Octokit({ auth: apiToken });
}

export async function getAllRecipes(): Promise<Recipe[]> {
    const recipeFolders = await getAllRecipeFolders();
    return Promise.all(recipeFolders.map(fetchRecipeData));
}

async function fetchRecipeData(folder: RecipeFolder): Promise<Recipe> {
    const recipeFolderContents = await getFolderContents(folder);

    const metadataFile = findCriticalFile(recipeFolderContents, folder, 'metadata.json');
    const metadata = await fetchMetadataObject(metadataFile.path);

    const recipeFile = findCriticalFile(recipeFolderContents, folder, '.pdf')
    const imageFile = findFile(recipeFolderContents, '.jpg', '.jpeg', '.png')

    return {
        metadata,
        metadataUrl: metadataFile.path,
        metadataSha: metadataFile.sha, 
        fileUrl: recipeFile.download_url,
        imageUrl: imageFile?.download_url
    };
}

async function fetchMetadataObject(metadataFilePath: string): Promise<Metadata> {
    
    const metadataResponse = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "SquigglyRoman",
        repo: "recipe-store",
        path: metadataFilePath
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

export async function updateMetadata(metadataPath: string, metadataSha: string, metadata: Metadata): Promise<void> {
    const metadataContent = JSON.stringify(metadata);
    console.log(metadataSha);
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner: "SquigglyRoman",
        repo: "recipe-store",
        path: "recipes/Gnocchi/metadata.json",
        message: "Update metadata",
        content: btoa(metadataContent),
        sha: metadataSha
    });
}
