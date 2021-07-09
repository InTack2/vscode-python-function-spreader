const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "python-print-spreader" is now active!');

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

    if (!editor) { return; }
    const document = editor.document;

    if (editor.selection.isEmpty) { return; }


    if (editor.selection.isSingleLine) {

        let sorted_selection_list = editor.selections.sort(function (a, b) {
            if (a.start.line < b.start.line) return 1;
            if (a.start.line > b.start.line) return -1;
            return 0;
        });

        for (let selection_index in sorted_selection_list) {
            let selection_position = sorted_selection_list[selection_index];

            if (selection_position.start.character == selection_position.end.character) { continue; }

            const selection_range = new vscode.Range(selection_position.start, selection_position.end);

            let word = document.getText(selection_range);

            let python_command = "\n" + eval("`" + python_template + "`");

            let python_snippet = new vscode.SnippetString(python_command);
            let insert_position = new vscode.Position(selection_position.start.line, selection_position.end.character);

            editor.insertSnippet(python_snippet, insert_position, { "undoStopAfter": false, "undoStopBefore": false });
        }
    }
}

module.exports = {
    activate,
    deactivate
}
