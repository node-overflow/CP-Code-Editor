require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' } });

require(['vs/editor/editor.main'], () => {

    monaco.editor.defineTheme('monokai', { base: 'vs-dark', inherit: true, rules: [{ background: '272822' }], colors: { 'editor.background': '#272822' } });
    monaco.editor.defineTheme('solarized-dark', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#002b36', 'editor.foreground': '#839496' } });
    monaco.editor.defineTheme('solarized-light', { base: 'vs', inherit: true, rules: [], colors: { 'editor.background': '#fdf6e3', 'editor.foreground': '#657b83' } });
    monaco.editor.defineTheme('dracula', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#282a36', 'editor.foreground': '#f8f8f2' } });
    monaco.editor.defineTheme('cobalt', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#002240', 'editor.foreground': '#ffffff' } });
    monaco.editor.defineTheme('quiet-light', { base: 'vs', inherit: true, rules: [], colors: { 'editor.background': '#f5f5f5', 'editor.foreground': '#333333' } });
    monaco.editor.defineTheme('twilight', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#141414', 'editor.foreground': '#f5f5f5' } });

    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: `#include "bits.h"\n\nint main() {\n    fio;\n\n    int n = 5;\n    cin >> n;\n    cout << n << "\\n";\n\n    return 0;\n}`,
        language: 'cpp',
        theme: 'vs-dark',
        fontSize: 16,
        automaticLayout: true,
        minimap: { enabled: true },
        wordWrap: 'on',
    });

    const themeSelector = document.getElementById('themeSelector');
    themeSelector.addEventListener('change', e => monaco.editor.setTheme(e.target.value));

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => runCode());
});

const runCode = async () => {
    const code = editor.getValue();
    const input = document.getElementById('input').value;

    const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input })
    });

    const data = await res.json();

    const runtimeText = `[Finished in ${data.runtime || 'N/A'}s]\n\n`;

    document.getElementById('output').textContent = runtimeText + (data.error || data.output);
};

document.getElementById('fontSizeSelector').addEventListener('change', e => {
    editor.updateOptions({ fontSize: parseInt(e.target.value) });
});

document.getElementById('runBtn').addEventListener('click', () => runCode());
