const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "python-print-spreader" is now active!');

    // let python_print_template = 'print("${word}", ${word})'

    let disposable = vscode.commands.registerCommand('python-print-spreader.helloWorld', function () {
        const config = vscode.workspace.getConfiguration("python-print-spreader");

        const python_template_list = config.get("target-function");

        vscode.window.showQuickPick(python_template_list)
            .then(result => { vscode.window.showInformationMessage(`Call  ${result}`); return result; })
            .then(result => { selection_word_choice_function_spreader(result) });

        vscode.window.showInformationMessage('Hello World from PythonPrintSpreader!');
    });

    context.subscriptions.push(disposable);
}

function deactivate() { }

async function selection_word_choice_function_spreader(python_template) {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const document = editor.document;

        if (!editor.selection.isEmpty) {
            const isSingle = editor.selection.isSingleLine;
            console.log("isSingle", isSingle);

            // 複数行をまとめて選択してないか？
            if (editor.selection.isSingleLine) {

                let sorted_selection_list = editor.selections.sort();
                // 選択範囲
                for (let selection_index in sorted_selection_list) {

                    let selection_position = sorted_selection_list[selection_index];

                    const selection_range = new vscode.Range(selection_position.start, selection_position.end);
                    console.log("start", selection_position.start);
                    console.log("end", selection_position.end);

                    let word = document.getText(selection_range);

                    let python_command = "\n" + eval("`" + python_template + "`");

                    let python_snippet = new vscode.SnippetString(python_command);

                    let insert_position = new vscode.Position(selection_position.start.line, selection_position.end.character);

                    editor.insertSnippet(python_snippet, insert_position, { "undoStopAfter": false, "undoStopBefore": false });
                    // 前か後かで選べても便利そう。
                }
            }
        }
    }
}

module.exports = {
    activate,
    deactivate
}
