import * as vscode from "vscode";
import { type CollectionManager } from "../services/collection-manager";
import { type CollectionsTreeProvider } from "./collections-tree-provider";

export async function handleNewCollection(
  manager: CollectionManager,
  treeProvider: CollectionsTreeProvider,
): Promise<void> {
  const name = await vscode.window.showInputBox({
    prompt: "Enter collection name",
    placeHolder: "e.g., Authentication Feature",
    validateInput: async (value) => {
      if (!value || value.trim().length === 0) {
        return "Collection name cannot be empty";
      }
      const collections = await manager.getCollections();
      const exists = collections.some((c) => c.name === value);
      return exists ? "Collection name must be unique" : undefined;
    },
  });

  if (name) {
    try {
      await manager.createCollection(name);
      treeProvider.refresh();
      vscode.window.showInformationMessage(`Collection "${name}" created successfully`);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to create collection: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
