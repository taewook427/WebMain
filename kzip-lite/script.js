// file selection status
const state = { compressFiles: [], decompressTarget: null };

// UI Elements
const dropComp = document.getElementById('drop-comp');
const inComp = document.getElementById('in-comp');
const filesComp = document.getElementById('files-comp');
const fmtComp = document.getElementById('fmt-comp');
const btnComp = document.getElementById('btn-comp');
const statusComp = document.getElementById('status-comp');
const dlComp = document.getElementById('dl-comp');

const dropDecomp = document.getElementById('drop-decomp');
const inDecomp = document.getElementById('in-decomp');
const infoDecomp = document.getElementById('info-decomp');
const btnDecompress = document.getElementById('btn-decomp');
const statusDecomp = document.getElementById('status-decomp');
const filesDecomp = document.getElementById('files-decomp');

// update UI
function showStatus(el, msg, type) {
    el.textContent = msg;
    el.className = `status ${type}`;
    el.style.display = 'block';
}

// web worker function
function archiverWorkerContext() {
    importScripts('https://cdn.jsdelivr.net/npm/7z-wasm@1.2.0/7zz.umd.js');

    // get all files recursively (for decompression)
    function getAllFiles(fs, dirPath, base = '') {
        const entries = fs.readdir(dirPath);
        let results = [];
        for (const entry of entries) {
            if (entry === '.' || entry === '..') continue;
            const fullPath = dirPath + '/' + entry;
            const relativePath = base ? base + '/' + entry : entry;
            const stat = fs.stat(fullPath);
            const isDir = fs.isDir ? fs.isDir(stat.mode) : ((stat.mode & 0xF000) === 0x4000);
            if (isDir) {
                results = results.concat(getAllFiles(fs, fullPath, relativePath));
            } else {
                results.push({ name: relativePath, data: fs.readFile(fullPath) });
            }
        }
        return results;
    }

    // clean virtual file system
    function cleanFS(fs, dirPath) {
        try {
            const entries = fs.readdir(dirPath);
            for (const entry of entries) {
                if (entry === '.' || entry === '..') continue;
                const fullPath = dirPath + '/' + entry;
                const stat = fs.stat(fullPath);
                const isDir = fs.isDir ? fs.isDir(stat.mode) : ((stat.mode & 0xF000) === 0x4000);
                if (isDir) {
                    cleanFS(fs, fullPath);
                    fs.rmdir(fullPath);
                } else {
                    fs.unlink(fullPath);
                }
            }
        } catch(e) {}
    }

    // run 7z
    function run7z(wasm, args) {
        try { wasm.callMain(args); } catch (e) {
            if (e.name !== 'ExitStatus' || e.status !== 0) throw e;
        }
    }

    // main message handler
    self.onmessage = async function(e) {
        const { type, format, files, archiveName, archiveData } = e.data;
        try {
            const wasm = await SevenZip({
                locateFile: (path) => 'https://cdn.jsdelivr.net/npm/7z-wasm@1.2.0/' + path
            });
            
            // compress
            if (type === 'compress') {
                const fileNames = [];
                files.forEach(f => {
                    const parts = f.name.split('/');
                    let currentPath = '';
                    for (let i = 0; i < parts.length - 1; i++) {
                        currentPath += (currentPath ? '/' : '') + parts[i];
                        try { wasm.FS.mkdir('/' + currentPath); } catch(err){}
                    }
                    wasm.FS.writeFile('/' + f.name, f.data);
                    fileNames.push(f.name);
                });
                
                // determine output name and run 7z
                let outName = 'archive.' + format;
                if (format === 'zip' || format === '7z') {
                    run7z(wasm, ['a', outName, ...fileNames]);
                } else if (format === 'tar.gz' || format === 'tar.xz') {
                    run7z(wasm, ['a', 'archive.tar', ...fileNames]);
                    if (format === 'tar.gz') {
                        run7z(wasm, ['a', 'archive.tar.gz', 'archive.tar']);
                        outName = 'archive.tar.gz';
                    } else {
                        run7z(wasm, ['a', 'archive.tar.xz', 'archive.tar']);
                        outName = 'archive.tar.xz';
                    }
                }
                const outData = wasm.FS.readFile('/' + outName);
                self.postMessage({ type: 'success', action: 'compress', data: outData, name: outName }, [outData.buffer]);
                
                // clean virtual file system to free memory
                fileNames.forEach(f => { try { wasm.FS.unlink('/' + f); } catch(err){} });
                try { wasm.FS.unlink('/' + outName); } catch(err){}
                try { wasm.FS.unlink('/archive.tar'); } catch(err){}

            // decompress
            } else if (type === 'decompress') {
                wasm.FS.writeFile('/' + archiveName, archiveData);
                
                try { cleanFS(wasm.FS, '/out'); wasm.FS.rmdir('/out'); } catch(err){}
                try { cleanFS(wasm.FS, '/out_final'); wasm.FS.rmdir('/out_final'); } catch(err){}
                
                wasm.FS.mkdir('/out');
                run7z(wasm, ['x', '/' + archiveName, '-o/out', '-y']);
                
                // extract tar if needed
                const outEntries = wasm.FS.readdir('/out');
                const tarFile = outEntries.find(name => name.toLowerCase().endsWith('.tar'));
                let finalDir = '/out';
                if (tarFile) {
                    wasm.FS.mkdir('/out_final');
                    run7z(wasm, ['x', '/out/' + tarFile, '-o/out_final', '-y']);
                    finalDir = '/out_final';
                }
                const extractedFiles = getAllFiles(wasm.FS, finalDir);
                self.postMessage({ type: 'success', action: 'decompress', files: extractedFiles });
                
                // clean virtual file system to free memory
                try { wasm.FS.unlink('/' + archiveName); } catch(err){}
                cleanFS(wasm.FS, '/out');
                cleanFS(wasm.FS, '/out_final');
            }
        } catch (err) {
            self.postMessage({ type: 'error', message: err.message || err.toString() });
        }
    };
}

// create web worker from function
const workerBlob = new Blob([`(${archiverWorkerContext.toString()})()`], { type: 'application/javascript' });
const archiverWorker = new Worker(URL.createObjectURL(workerBlob));


// link compression events
dropComp.addEventListener('click', () => inComp.click());
dropComp.addEventListener('dragover', (e) => e.preventDefault());
dropComp.addEventListener('drop', (e) => { e.preventDefault(); handleCompressFiles(e.dataTransfer.files); });
inComp.addEventListener('change', (e) => handleCompressFiles(e.target.files));

// handle file selection for compression
async function handleCompressFiles(fileList) {
    for (let file of fileList) {
        const buffer = await file.arrayBuffer();
        // keep relative path for folder upload
        const targetName = file.webkitRelativePath || file.name;
        state.compressFiles.push({ name: targetName, data: new Uint8Array(buffer) });
        
        const li = document.createElement('li');
        li.textContent = targetName;
        filesComp.appendChild(li);
    }
    if (state.compressFiles.length > 0) {
        showStatus(statusComp, `${state.compressFiles.length} files selected.`, 'info');
    }
}

// handle compression
btnComp.addEventListener('click', () => {
    if (state.compressFiles.length === 0) return showStatus(statusComp, 'Select files first.', 'error');
    showStatus(statusComp, 'Compressing...', 'info');
    dlComp.innerHTML = '';

    const format = fmtComp.value;
    archiverWorker.postMessage({
        type: 'compress',
        format: format,
        files: state.compressFiles
    });
});

// link decompression events
dropDecomp.addEventListener('click', () => inDecomp.click());
dropDecomp.addEventListener('dragover', (e) => e.preventDefault());
dropDecomp.addEventListener('drop', (e) => { e.preventDefault(); if(e.dataTransfer.files.length) handleDecompressFile(e.dataTransfer.files[0]); });
inDecomp.addEventListener('change', (e) => { if(e.target.files.length) handleDecompressFile(e.target.files[0]); });

// handle file selection for decompression
function handleDecompressFile(file) {
    state.decompressTarget = file;
    infoDecomp.textContent = `Selected: ${file.name}`;
    filesDecomp.innerHTML = '';
    statusDecomp.style.display = 'none';
}

// handle decompression
btnDecompress.addEventListener('click', async () => {
    if (!state.decompressTarget) return showStatus(statusDecomp, 'Select archive first.', 'error');
    showStatus(statusDecomp, 'Decompressing...', 'info');
    filesDecomp.innerHTML = '';

    const arrayBuffer = await state.decompressTarget.arrayBuffer();
    archiverWorker.postMessage({
        type: 'decompress',
        archiveName: state.decompressTarget.name,
        archiveData: new Uint8Array(arrayBuffer)
    });
});

// handle worker responses
archiverWorker.onmessage = function(e) {
    const response = e.data;
    if (response.type === 'error') {
        showStatus(statusComp, `Error: ${response.message}`, 'error');
        showStatus(statusDecomp, `Error: ${response.message}`, 'error');
        return;
    }
    
    if (response.type === 'success') {
        // compression result
        if (response.action === 'compress') {
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/octet-stream' }));
            dlComp.innerHTML = `<a href="${url}" download="${response.name}"><button style="background:#28a745;border-color:#28a745;">Download ${response.name}</button></a>`;
            showStatus(statusComp, 'Success!', 'success');
        } 
        
        // decompression result
        else if (response.action === 'decompress') {
            response.files.forEach(file => {
                const li = document.createElement('li');
                const url = URL.createObjectURL(new Blob([file.data], { type: 'application/octet-stream' }));
                const a = document.createElement('a');
                
                a.href = url;
                a.download = file.name.replace(/\//g, '.');
                a.textContent = `📁 ${file.name}`;
                
                li.appendChild(a);
                filesDecomp.appendChild(li);
            });
            showStatus(statusDecomp, 'Done! Click file to download.', 'success');
            state.decompressTarget = null;
        }
    }
};