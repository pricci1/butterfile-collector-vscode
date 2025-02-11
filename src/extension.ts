import * as vscode from "vscode";
import { JSONStorageProvider } from "./storage/json-storage-provider";
import { CollectionManager } from "./services/collection-manager";
import { CollectionsTreeProvider } from "./ui/collections-tree-provider";
import { registerCollectionCommands } from "./ui/commands";
import { registerExplorerIntegration } from "./ui/explorer-integration";
import { handleNewCollection } from "./ui/input-handlers";

export function activate(context: vscode.ExtensionContext) {
  const storageProvider = new JSONStorageProvider();
  const collectionManager = new CollectionManager(storageProvider);

  const treeProvider = new CollectionsTreeProvider(collectionManager);
  const treeView = vscode.window.createTreeView("fileCollectionsView", {
    treeDataProvider: treeProvider,
    showCollapseAll: true,
    canSelectMany: false,
  });

  registerCollectionCommands(context, collectionManager, treeProvider);
  registerExplorerIntegration(context, collectionManager, treeProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand("fileCollections.newCollection", () =>
      handleNewCollection(collectionManager, treeProvider),
    ),
  );

  context.subscriptions.push(treeView);
}

export function deactivate() {}
