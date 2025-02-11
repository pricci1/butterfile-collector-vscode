import * as vscode from "vscode";

export function toWorkspaceRelativePath(uri: vscode.Uri): string {
  const relative = vscode.workspace.asRelativePath(uri);
  return relative.replace(/\\/g, "/"); // Normalize to POSIX
}

export function toAbsolutePath(relativePath: string): vscode.Uri {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri;
  if (!workspaceRoot) throw new Error("No workspace open");
  return vscode.Uri.joinPath(workspaceRoot, relativePath);
}

export function validateWorkspacePath(path: string): boolean {
  try {
    const uri = toAbsolutePath(path);
    return !!uri;
  } catch {
    return false;
  }
}
