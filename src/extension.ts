import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "file-collections" is now active!');

  const disposable = vscode.commands.registerCommand("file-collections.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from Butterfile Collector!");
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
