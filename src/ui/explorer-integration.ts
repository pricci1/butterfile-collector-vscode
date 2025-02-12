import * as vscode from "vscode";
import { type CollectionManager } from "../services/collection-manager";
import { type CollectionsTreeProvider } from "./collections-tree-provider";

export function registerExplorerIntegration(
  context: vscode.ExtensionContext,
  manager: CollectionManager,
  treeProvider: CollectionsTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand("fileCollections.addToCollection", async (uri: vscode.Uri) => {
      const collections = await manager.getCollections();
      if (collections.length === 0) {
        vscode.window.showWarningMessage("No collections exist yet. Create one first!");
        return;
      }

      const selected = await vscode.window.showQuickPick(
        collections.map((c) => c.name),
        {
          placeHolder: "Select collection to add file to",
        },
      );

      if (selected) {
        await manager.addFilesToCollection(selected, [vscode.workspace.asRelativePath(uri)]);
        treeProvider.refresh();
        vscode.window.showInformationMessage(`File added to collection "${selected}"`);
      }
    }),
  );
}
