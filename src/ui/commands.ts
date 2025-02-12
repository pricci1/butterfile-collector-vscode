import * as vscode from "vscode";
import type { Collection } from "../storage/types";
import type { CollectionManager } from "../services/collection-manager";
import type { CollectionsTreeProvider } from "./collections-tree-provider";
import type { CollectionTreeItem, FileTreeItem } from "./tree-items";
import { toAbsolutePath } from "../utils/path-resolver";

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
    vscode.commands.registerCommand(
      "fileCollections.addActiveEditorFile",
      async (item: CollectionTreeItem) => {
        const collections = await manager.getCollections();
        if (collections.length === 0) {
          vscode.window.showWarningMessage("No collections exist yet. Create one first!");
          return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showInformationMessage("No active editor to add.");
          return;
        }

        const fileUri = editor?.document?.uri;
        const selectedCollection = item.collection.name;

        if (selectedCollection) {
          await manager.addFilesToCollection(selectedCollection, [
            vscode.workspace.asRelativePath(fileUri),
          ]);
          treeProvider.refresh();
          vscode.window.showInformationMessage(`File added to collection "${selectedCollection}"`);
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fileCollections.copyPaths",
      async (item: CollectionTreeItem) => {
        const config = vscode.workspace.getConfiguration("fileCollections");
        const separator = config.get<string>("pathSeparator") ?? " ";
        const useRelativePath = config.get<boolean>("copyRelativePath") ?? true;

        const paths = item.collection.files.map((file) => {
          if (useRelativePath) {
            return file;
          }
          return toAbsolutePath(file).fsPath;
        });

        const pathString = paths.join(separator);
        await vscode.env.clipboard.writeText(pathString);
        vscode.window.showInformationMessage(
          `Paths from "${item.collection.name}" copied to clipboard`,
        );
      },
    ),
  );

  vscode.commands.registerCommand("fileCollections.removeFile", async (fileItem: FileTreeItem) => {
    if (!fileItem) {
      return;
    }

    const relativePath = vscode.workspace.asRelativePath(fileItem.filePath);
    await manager.removeFilesFromCollection(fileItem.collection.name, [relativePath]);

    treeProvider.refresh();
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("fileCollections.refresh", () => {
      treeProvider.refresh();
    }),
  );
}
