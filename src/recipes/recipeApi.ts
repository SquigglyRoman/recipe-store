import { Octokit } from "octokit";
import { decodeToObject, encodeFile, encodeObject } from "./Base64";
import { GitFile, GitFileWithContent, Metadata, Recipe } from "./models";
let octokit: Octokit;


const owner = "SquigglyRoman";
const repo = "recipe-store";
const recipesRootFolder = "recipes";
const repoRootUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master`;

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
    const { recipeFile: currentRecipeFile, thumbnail: currentThumbnail } = await fetchRecipeFiles(recipeRootPath);
    
    const {recipes, sha} = await getRecipeList();
    const recipe = recipes.find(recipe => recipe.path === recipeRootPath);
    if (!recipe) {
        throw new Error(`No recipe found at ${recipeRootPath}`);
    }
    recipe.metadata = newMetadata;
    newRecipeFile && (recipe.recipeFileUrl = `${repoRootUrl}/${recipeRootPath}/${newRecipeFile.name}`);
    newThumbnail && (recipe.thumbnailUrl = `${repoRootUrl}/${recipeRootPath}/${newThumbnail.name}`);
    
    newRecipeFile && await replaceFile(recipeRootPath, newRecipeFile, currentRecipeFile);
    newThumbnail && await replaceFile(recipeRootPath, newThumbnail, currentThumbnail);
    await put(encodeObject(recipes), `${recipesRootFolder}/recipes.json`, sha);
}

export async function uploadNewRecipe(metadata: Metadata, recipeFile: File, thumbnail?: File): Promise<void> {
    const newRecipeRootFolder = `${recipesRootFolder}/${metadata.name}`;
    const newRecipeRootUrl = `${repoRootUrl}/${newRecipeRootFolder}`;
    const newRecipe: Recipe = {
        metadata,
        path: newRecipeRootFolder,
        recipeFileUrl: `${newRecipeRootUrl}/${recipeFile.name}`,
        thumbnailUrl: thumbnail && `${newRecipeRootUrl}/${thumbnail.name}`
    }

    await uploadFile(recipeFile, `${newRecipeRootFolder}/${recipeFile.name}`);
    thumbnail && await uploadFile(thumbnail, `${newRecipeRootFolder}/${thumbnail.name}`);
    await addRecipeToRecipesList(newRecipe);
}

async function addRecipeToRecipesList(recipe: Recipe): Promise<void> {
    const {recipes, sha} = await getRecipeList();
    recipes.push(recipe);
    await put(encodeObject(recipes), `${recipesRootFolder}/recipes.json`, sha);
}

async function getRecipeList(): Promise<{ recipes: Recipe[]; sha: string }> {
    const recipesList = await get<GitFileWithContent>(`${recipesRootFolder}/recipes.json`);
    return { recipes: decodeToObject<Recipe[]>(recipesList.content), sha: recipesList.sha };
}

export async function deleteRecipe(recipeRootPath: string): Promise<void> {
    const { recipeFile, thumbnail } = await fetchRecipeFiles(recipeRootPath);

    const {recipes, sha} = await getRecipeList();
    const recipeIndex = recipes.findIndex(recipe => recipe.path === recipeRootPath);
    if (recipeIndex === -1) {
        throw new Error(`No recipe found at ${recipeRootPath}`);
    }
    recipes.splice(recipeIndex, 1);

    await put(encodeObject(recipes), `${recipesRootFolder}/recipes.json`, sha);
    await deleteResource(recipeFile.path, recipeFile.sha);
    thumbnail && await deleteResource(thumbnail.path, thumbnail.sha);
}

function initApi(apiToken: string) {
    octokit = new Octokit({ auth: apiToken });
}

async function fetchRecipeFiles(recipeRootPath: string): Promise<{ recipeFile: GitFile, thumbnail?: GitFile }> {
    const recipeFolderContents = await get<GitFile[]>(recipeRootPath);

    const recipeFile = findCriticalFile(recipeFolderContents, /pdf$/i);
    const thumbnail = findFile(recipeFolderContents, /\.(jpg|jpeg|png|webp)$/i);
    return { recipeFile, thumbnail };
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
