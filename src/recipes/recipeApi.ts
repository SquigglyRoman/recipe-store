import { Octokit } from "octokit";
import { Metadata, Recipe, RecipeFolder, RecipeFolderContents } from "./models";
import { toBase64 } from "./Base64";

let octokit: Octokit;

const noCacheHeader: Record<string, string> = {
    'If-None-Match': ''
};

const owner = "SquigglyRoman";
const repo = "recipe-store";

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
    const recipeFolders = await getAllRecipeFolders();
    return Promise.all(recipeFolders.map(fetchRecipeData));
}

export async function updateMetadata(recipe: Recipe): Promise<void> {
    const metadata = recipe.metadata;
    const metadataContent = JSON.stringify(metadata);
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner: "SquigglyRoman",
        repo: "recipe-store",
        path: recipe.files.metadata.path,
        message: "Update metadata",
        content: btoa(metadataContent),
        sha: recipe.files.metadata.sha
    });

    return await waitUntilFileUpdated(recipe);
}

export async function uploadRecipeFile(recipe: Recipe, file: File): Promise<void> {
    console.log(`Uploading recipe file ${file.name} to ${recipe.path}`);
    const path = recipe.files.recipe.path;
    const sha = recipe.files.recipe.sha;

    if (recipe.files.recipe.name === file.name) {
        await updateExistingFile(file, path, sha);
        return;
    }
    await uploadNewFile(file, `${recipe.path}/${file.name}`)
    await deleteFile(path, sha);
}

export async function uploadThumbnail(recipe: Recipe, file: File): Promise<void> {
    const path = `${recipe.path}/${file.name}`;
    console.log(`Updating thumbnail ${path}`);
    const base64Content = await toBase64(file);

    const recipeCurrentlyHasNoThumbnail = !recipe.files.previewImage;
    const newFileHasDiffentNameThanCurrentThumbnail = recipe.files.previewImage?.name !== file.name;

    if(recipeCurrentlyHasNoThumbnail) {
        await put(base64Content, path);
    } else if(newFileHasDiffentNameThanCurrentThumbnail) {
        await put(base64Content, path);
        await deleteFile(recipe.files.previewImage?.path ?? '', recipe.files.previewImage?.sha ?? '');
    } else {
        await put(base64Content, path, recipe.files.previewImage?.sha);
    }
}

function initApi(apiToken: string) {
    octokit = new Octokit({ auth: apiToken });
}

async function fetchRecipeData(folder: RecipeFolder): Promise<Recipe> {
    const recipeFolderContents = await getFolderContents(folder);

    const metadataFile = findCriticalFile(recipeFolderContents, folder, 'metadata.json');
    const metadata = await fetchMetadataObject(metadataFile.path);

    const recipeFile = findCriticalFile(recipeFolderContents, folder, '.pdf')
    const imageFile = findFile(recipeFolderContents, '.jpg', '.jpeg', '.png')

    return {
        metadata,
        files: {
            metadata: {
                name: metadataFile.name,
                sha: metadataFile.sha,
                path: metadataFile.path,
                url: metadataFile.download_url
            },
            recipe: {
                name: recipeFile.name,
                sha: recipeFile.sha,
                path: recipeFile.path,
                url: recipeFile.download_url
            },
            previewImage: imageFile ? {
                name: imageFile.name,
                sha: imageFile.sha,
                path: imageFile.path,
                url: imageFile.download_url
            } : undefined
        },
        path: folder.path
    };
}

async function fetchMetadataObject(metadataFilePath: string): Promise<Metadata> {

    const metadataResponse = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path: metadataFilePath,
        headers: noCacheHeader
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
    return recipeFolderContents.find(file => lowercaseFileEndings.some(ending => file.name.toLowerCase().endsWith(ending.toLowerCase())));
}

async function getFolderContents(folder: RecipeFolder): Promise<RecipeFolderContents[]> {
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "SquigglyRoman",
        repo: "recipe-store",
        path: folder.path,
        headers: noCacheHeader
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

async function uploadNewFile(file: File, path: string): Promise<void> {
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: path,
        message: `Updated file ${path}`,
        content: await toBase64(file),
    });
}

async function updateExistingFile(file: File, path: string, sha: string): Promise<void> {
    console.log(`Updating existing file ${path}`);

    await put(await toBase64(file), path, sha);
}

async function put(base64Content: string, path: string, sha?: string) {
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: `Updated file ${path}`,
        content: base64Content,
        sha
    });
}

export async function deleteFile(path: string, sha: string): Promise<void> {
    await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: `Deleted file ${path}`,
        sha
    });
}

async function waitUntilFileUpdated(recipe: Recipe): Promise<void> {
    let metadataNotUpdated = true;
    do {
        const metadata: Metadata = await fetchMetadataObject(recipe.files.metadata.path);
        if (metadata.name === recipe.metadata.name) {
            metadataNotUpdated = false;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    } while (metadataNotUpdated);

    return Promise.resolve();
}
