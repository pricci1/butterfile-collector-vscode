import * as vscode from "vscode";
import { Collection, StorageProvider } from "./types";

export class JSONStorageProvider implements StorageProvider {
  private readonly COLLECTIONS_FILE = ".vscode/file-collections.json";

  async loadCollections(): Promise<Collection[]> {
    try {
      const rawData = await vscode.workspace.fs.readFile(this.getUri());
      return JSON.parse(rawData.toString()).collections;
    } catch (error: any) {
      if (error.code === "ENOENT") return []; // File not found
      throw new Error("Failed to parse collections file");
    }
  }

  async saveCollections(collections: Collection[]): Promise<void> {
    const data = JSON.stringify({ version: 1, collections }, null, 2);
    await vscode.workspace.fs.writeFile(this.getUri(), Buffer.from(data));
  }

  async validateWorkspace(): Promise<boolean> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0];
    return !!workspaceRoot;
  }

  private getUri(): vscode.Uri {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri;
    if (!workspaceRoot) throw new Error("No workspace open");
    return vscode.Uri.joinPath(workspaceRoot, this.COLLECTIONS_FILE);
  }
}
