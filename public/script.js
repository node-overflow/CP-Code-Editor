require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: `#include "bits.h"\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    cout << n << "\\n";\n\n    return 0;\n}`,
        language: 'cpp',
        theme: 'vs-dark',
        fontSize: 16,
        automaticLayout: true,
        minimap: { enabled: false },
    });
});

document.getElementById('runBtn').addEventListener('click', async () => {
    const code = editor.getValue();
    const input = document.getElementById('input').value;

    const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input })
    });

    const data = await res.json();
    document.getElementById('output').textContent = data.output || data.error;
});
