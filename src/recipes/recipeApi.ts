import { Octokit } from "octokit";
import { decodeToObject, encodeFile, encodeObject } from "./Base64";
import { GitFile, GitFileWithContent, Metadata, Recipe } from "./models";
let octokit: Octokit;


const owner = "SquigglyRoman";
const repo = "recipe-store";
const recipesRootFolder = "recipes";

export async function checkTokenValidity(apiToken: string): Promise<boolean> {
    initApi(apiToken);
    try {
        await octokit.request("GET /user");
        return true;
    } catch (error) {
        return false;
    }
}

export async function getAllRecipes(): Promise<Recipe[]> {
    const recipesList = await get<GitFileWithContent>(`${recipesRootFolder}/recipes.json`);
    return decodeToObject<Recipe[]>(recipesList.content);
}

export async function updateRecipe(recipeRootPath: string, newMetadata: Metadata, newRecipeFile?: File, newThumbnail?: File): Promise<void> {
    const { metadata: currentMetadata, recipeFile: currentRecipeFile, thumbnail: currentThumbnail } = await fetchRecipeFiles(recipeRootPath);

    await uploadMetadata(newMetadata, recipeRootPath, currentMetadata);
    newRecipeFile && await replaceFile(recipeRootPath, newRecipeFile, currentRecipeFile);
    newThumbnail && await replaceFile(recipeRootPath, newThumbnail, currentThumbnail);
}

export async function uploadNewRecipe(metadata: Metadata, recipeFile: File, thumbnail?: File): Promise<void> {
    const newRecipeRootFolder = `${recipesRootFolder}/${metadata.name}`;
    const newRecipeRootUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/recipes/${newRecipeRootFolder}`;
    const newRecipe: Recipe = {
        metadata, 
        path: newRecipeRootFolder,
        recipeFileUrl: `${newRecipeRootUrl}/${recipeFile.name}`,
        thumbnailUrl: thumbnail && `${newRecipeRootUrl}/${thumbnail.name}`
    }
    addRecipeToRecipesList(newRecipe);

    await uploadMetadata(metadata, newRecipeRootFolder);
    await uploadFile(recipeFile, `${newRecipeRootFolder}/${recipeFile.name}`);
    thumbnail && await uploadFile(thumbnail, `${newRecipeRootFolder}/${thumbnail.name}`);
}

async function addRecipeToRecipesList(recipe: Recipe): Promise<void> {
    const recipesList = await get<GitFileWithContent>(`${recipesRootFolder}/recipes.json`);
    const recipes = decodeToObject<Recipe[]>(recipesList.content);
    recipes.push(recipe);
    await put(encodeObject(recipes), `${recipesRootFolder}/recipes.json`, recipesList.sha);
}

export async function deleteRecipe(recipeRootPath: string): Promise<void> {
    const { metadata, recipeFile, thumbnail } = await fetchRecipeFiles(recipeRootPath);

    await deleteResource(metadata.path, metadata.sha);
    await deleteResource(recipeFile.path, recipeFile.sha);
    thumbnail && await deleteResource(thumbnail.path, thumbnail.sha);
}

function initApi(apiToken: string) {
    octokit = new Octokit({ auth: apiToken });
}

async function fetchRecipeFiles(recipeRootPath: string): Promise<{ metadata: GitFile, recipeFile: GitFile, thumbnail?: GitFile }> {
    const recipeFolderContents = await get<GitFile[]>(recipeRootPath);

    const metadata = findCriticalFile(recipeFolderContents, /metadata\.json/);
    const recipeFile = findCriticalFile(recipeFolderContents, /pdf$/i);
    const thumbnail = findFile(recipeFolderContents, /\.(jpg|jpeg|png|webp)$/i);
    return { metadata, recipeFile, thumbnail };
}

function findCriticalFile(recipeFolderContents: GitFile[], regexp: RegExp): GitFile {
    const file = findFile(recipeFolderContents, regexp);
    if (!file) {
        throw new Error(`No file matching ${regexp} found.`);
    }
    return file;
}

function findFile(recipeFolderContents: GitFile[], regexp: RegExp): GitFile | undefined {
    return recipeFolderContents.find(file => file.name.match(regexp));
}

async function uploadMetadata(newMetadata: Metadata, recipePath: string, currentMetadata?: GitFile): Promise<void> {
    const path = `${recipePath}/metadata.json`;
    await put(encodeObject<Metadata>(newMetadata), path, currentMetadata?.sha);
}

async function replaceFile(recipeRootPath: string, file: File, currentFile?: GitFile): Promise<void> {
    currentFile && await deleteGitFile(currentFile);
    await uploadFile(file, `${recipeRootPath}/${file.name}`);
}

/**
 * @param sha optional, needed if the file already exists 
 */
async function uploadFile(file: File, path: string, sha?: string): Promise<void> {
    await put(await encodeFile(file), path, sha);
}

async function get<T>(path: string, cacheEnabled?: boolean): Promise<T> {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        headers: cacheEnabled ? {} : {
            'If-None-Match': ''
        }
    });
    return response.data;
}

/**
 * @param sha optional, needed if the file already exists 
 */
async function put(base64Content: string, path: string, sha?: string) {
    console.log(`Uploading ${path}`);
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: `Uploaded ${path}`,
        content: base64Content,
        sha
    });
}

async function deleteGitFile(file: GitFile): Promise<void> {
    await deleteResource(file.path, file.sha);
}

async function deleteResource(path: string, sha: string): Promise<void> {
    console.log(`Deleting ${path}`);
    await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: `Deleted ${path}`,
        sha
    });
}
