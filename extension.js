const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "python-function-spreader" is now active!');

    let disposable = vscode.commands.registerCommand('python-function-spreader.execute-spreader', function () {
        const config = vscode.workspace.getConfiguration("python-function-spreader");

        const python_template_list = config.get("function-list");

        vscode.window.showQuickPick(python_template_list)
            .then(result => { selection_word_choice_function_spreader(result) });
    });

    context.subscriptions.push(disposable);
}

function deactivate() { }

async function selection_word_choice_function_spreader(python_template) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) { return; }
    const document = editor.document;

    if (editor.selection.isEmpty) { return; }

    let sorted_selection_list = editor.selections.sort(function (a, b) {
        if (a.start.line < b.start.line) return 1;
        if (a.start.line > b.start.line) return -1;
        return 0;
    });

    for (let selection_index in sorted_selection_list) {

        if (!sorted_selection_list[selection_index].isSingleLine) {
            continue
        }
        let selection_position = sorted_selection_list[selection_index];

        if (selection_position.start.character == selection_position.end.character) { continue; }

        const selection_range = new vscode.Range(selection_position.start, selection_position.end);

        const word = document.getText(selection_range);

        let python_command = "\n" + eval("`" + python_template + "`");

        let cursor_end_character = document.lineAt(selection_position.start.line).range.end.character;
        let insert_position = new vscode.Position(selection_position.start.line, cursor_end_character);

        let python_snippet = new vscode.SnippetString(python_command);
        editor.insertSnippet(python_snippet, insert_position, { "undoStopAfter": false, "undoStopBefore": false });
    }
}

module.exports = {
    activate,
    deactivate
}
