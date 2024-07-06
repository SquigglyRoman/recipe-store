import { Octokit } from "octokit";
import { Metadata, Recipe, RecipeFolder, RecipeFolderContents } from "./models";

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
    return recipeFolderContents.find(file => lowercaseFileEndings.some(ending => file.name.endsWith(ending.toLowerCase())));
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
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            try {
                const arrayBuffer = reader.result as ArrayBuffer;

                await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner,
                    repo,
                    path: `${recipe.path}/${file.name}`,
                    message: `Updated recipe file of ${recipe.metadata.name}`,
                    content: arrayBufferToBase64(arrayBuffer),
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        }
    })

}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}


async function waitUntilFileUpdated(recipe: Recipe): Promise<void> {
    let metadataNotUpdated = true;
    do {
        const metadata: Metadata = await fetchMetadataObject(recipe.files.metadata.path);
        if (metadata.name === recipe.metadata.name) {
            metadataNotUpdated = false;
        }
    } while (metadataNotUpdated);

    return Promise.resolve();
}
