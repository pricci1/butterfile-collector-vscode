import * as vscode from "vscode";
import { Collection } from "../storage/types";
import { CollectionManager } from "../services/collection-manager";

export class CollectionTreeItem extends vscode.TreeItem {
  constructor(
    public readonly collection: Collection,
    public readonly manager: CollectionManager,
  ) {
    super(collection.name, vscode.TreeItemCollapsibleState.Collapsed);
    this.iconPath = new vscode.ThemeIcon("folder-library");
    this.contextValue = "collection"; // To target from packgage.json>contributes>menus
  }
}

export class FileTreeItem extends vscode.TreeItem {
  constructor(
    public readonly filePath: string,
    public readonly collection: Collection,
  ) {
    super(vscode.workspace.asRelativePath(filePath));
    this.iconPath = vscode.ThemeIcon.File;
    this.resourceUri = vscode.Uri.file(filePath);
    this.contextValue = "collectionFile";
  }
}
