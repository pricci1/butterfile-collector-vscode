import * as vscode from "vscode";
import { CollectionManager } from "../services/collection-manager";
import { CollectionTreeItem, FileTreeItem } from "./tree-items";

export class CollectionsTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private manager: CollectionManager) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (!element) {
      // Root level - show all collections
      const collections = await this.manager.getCollections();
      return collections.map((c) => new CollectionTreeItem(c, this.manager));
    }

    if (element instanceof CollectionTreeItem) {
      // Collection level - show files
      return element.collection.files.map(
        (f) =>
          new FileTreeItem(
            vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, f).fsPath,
            element.collection,
          ),
      );
    }

    return [];
  }
}
