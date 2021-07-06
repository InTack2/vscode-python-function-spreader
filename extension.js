const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "python-print-spreader" is now active!');

	let disposable = vscode.commands.registerCommand('python-print-spreader.helloWorld', function () {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;

			if (!editor.selection.isEmpty) {
				const isSingle = editor.selection.isSingleLine;
				console.log("isSingle", isSingle);

				// 複数行をまとめて選択してないか？
				if (editor.selection.isSingleLine) {
					// 選択範囲
					for (let selection_index in editor.selections) {
						console.log("selection_index", selection_index);

						const selection_range = new vscode.Range(editor.selections[selection_index].start, editor.selections[selection_index].end);
						let word = document.getText(selection_range);
						console.log("word", word);

						// ワードは取れてるので後は改行して選択対象を含んだprint文を次の行に挿入する。
						// 前か後かで選べても便利そう。
					}
				}
			}
		}
		vscode.window.showInformationMessage('Hello World from PythonPrintSpreader!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
