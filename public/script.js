require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' } });

require(['vs/editor/editor.main'], () => {

    monaco.editor.defineTheme('monokai', { base: 'vs-dark', inherit: true, rules: [{ background: '272822' }], colors: { 'editor.background': '#272822' } });
    monaco.editor.defineTheme('solarized-dark', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#002b36', 'editor.foreground': '#839496' } });
    monaco.editor.defineTheme('solarized-light', { base: 'vs', inherit: true, rules: [], colors: { 'editor.background': '#fdf6e3', 'editor.foreground': '#657b83' } });
    monaco.editor.defineTheme('dracula', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#282a36', 'editor.foreground': '#f8f8f2' } });
    monaco.editor.defineTheme('cobalt', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#002240', 'editor.foreground': '#ffffff' } });
    monaco.editor.defineTheme('quiet-light', { base: 'vs', inherit: true, rules: [], colors: { 'editor.background': '#f5f5f5', 'editor.foreground': '#333333' } });
    monaco.editor.defineTheme('twilight', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#141414', 'editor.foreground': '#f5f5f5' } });
    monaco.editor.defineTheme('one-dark-pro', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#282c34', 'editor.foreground': '#abb2bf' } });
    monaco.editor.defineTheme('material-dark', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#263238', 'editor.foreground': '#EEFFFF' } });
    monaco.editor.defineTheme('night-owl', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#011627', 'editor.foreground': '#d6deeb' } });
    monaco.editor.defineTheme('palenight', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#292d3e', 'editor.foreground': '#a6accd' } });
    monaco.editor.defineTheme('vscode-dark-plus', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#1e1e1e', 'editor.foreground': '#d4d4d4' } });
    monaco.editor.defineTheme('ayu-dark', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#0f1419', 'editor.foreground': '#ffffff' } });
    monaco.editor.defineTheme('ayu-mirage', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#1f2430', 'editor.foreground': '#ffffff' } });
    monaco.editor.defineTheme('gruvbox-dark', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#282828', 'editor.foreground': '#ebdbb2' } });
    monaco.editor.defineTheme('nord', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#2e3440', 'editor.foreground': '#d8dee9' } });
    monaco.editor.defineTheme('cobalt2', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#193549', 'editor.foreground': '#ffffff' } });

    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: `#include "bits.h"

int main() {
    fio;
    
    int tt = 1;
    cin >> tt;
    while (tt--) {
        
    }
}`,
        language: 'cpp',
        fontFamily: 'Fira Code, monospace',
        theme: 'night-owl',
        fontSize: 20,
        automaticLayout: true,
        minimap: { enabled: true },
        wordWrap: 'on',
        multiCursorModifier: 'ctrlCmd',
        multiCursorMergeOverlapping: true,
        mouseWheelZoom: true,
    });

    const themeSelector = document.getElementById('themeSelector');
    themeSelector.addEventListener('change', e => monaco.editor.setTheme(e.target.value));

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => runCode());

    let timerInterval = null;
    const timerDisplay = document.getElementById('timerDisplay');
    const toggleBtn = document.getElementById('toggleTimerBtn');
    const resetBtn = document.getElementById('resetTimerBtn');
    let totalSeconds = 0;
    let isRunning = false;
    let isPaused = false;

    timerDisplay.style.color = 'white';

    const updateDisplay = () => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        timerDisplay.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        timerInterval = setInterval(() => {
            totalSeconds++;
            updateDisplay();
        }, 1000);
        isRunning = true;
        isPaused = false;
        toggleBtn.textContent = "Pause";
        timerDisplay.style.color = 'lightgreen';
    };

    const pauseTimer = () => {
        clearInterval(timerInterval);
        isPaused = true;
        toggleBtn.textContent = "Resume";
        timerDisplay.style.color = 'orange';
    };

    const resumeTimer = () => {
        startTimer();
        toggleBtn.textContent = "Pause";
        timerDisplay.style.color = 'lightgreen';
    };

    const resetTimer = () => {
        clearInterval(timerInterval);
        totalSeconds = 0;
        updateDisplay();
        isRunning = false;
        isPaused = false;
        toggleBtn.textContent = "Start";
        timerDisplay.style.color = 'white';
    };

    toggleBtn.addEventListener('click', () => {
        if (!isRunning) {
            startTimer();
        } else if (isRunning && !isPaused) {
            pauseTimer();
        } else if (isPaused) {
            resumeTimer();
        }
    });

    resetBtn.addEventListener('click', resetTimer);
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
