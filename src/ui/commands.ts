import * as vscode from "vscode";
import { Collection } from "../storage/types";
import { CollectionManager } from "../services/collection-manager";
import { CollectionsTreeProvider } from "./collections-tree-provider";
import { CollectionTreeItem } from "./tree-items";

export function registerCollectionCommands(
  context: vscode.ExtensionContext,
  manager: CollectionManager,
  treeProvider: CollectionsTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand("fileCollections.openAll", async (item: CollectionTreeItem) => {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Opening ${item.collection.name} files...`,
        },
        async () => {
          for (const file of item.collection.files) {
            const uri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, file);
            await vscode.window.showTextDocument(uri);
          }
        },
      );
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fileCollections.addFiles", async (collection: Collection) => {
      const uris = await vscode.window.showOpenDialog({
        canSelectMany: true,
        defaultUri: vscode.workspace.workspaceFolders?.[0].uri,
      });
      if (uris) {
        await manager.addFilesToCollection(
          collection.name,
          uris.map((uri) => vscode.workspace.asRelativePath(uri)),
        );
        treeProvider.refresh();
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fileCollections.refresh", () => {
      treeProvider.refresh();
    }),
  );
}
