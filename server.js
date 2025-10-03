const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/run', (req, res) => {
    const code = req.body.code;
    const input = req.body.input || '';

    const filePath = path.join(__dirname, 'temp.cpp');
    fs.writeFileSync(filePath, code);

    exec(`g++ "${filePath}" -o temp.exe`, (err, stdout, stderr) => {
        if (err) return res.json({ error: stderr });

        const exeFile = process.platform === 'win32' ? 'temp.exe' : './temp.exe';

        const start = Date.now();

        const runProcess = exec(exeFile, (err, stdout, stderr) => {
            const end = Date.now();
            const runtime = ((end - start) / 1000).toFixed(3);

            if (err) return res.json({ error: stderr, runtime });

            res.json({ output: stdout, runtime });
        });

        if (input) runProcess.stdin.write(input);
        runProcess.stdin.end();
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
