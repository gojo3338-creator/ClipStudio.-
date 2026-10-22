/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
impor { CORE_URL, FFMessageType } dari "./const.js";
impor { ERROR_UNKNOWN_MESSAGE_TYPE, ERROR_NOT_LOADED, ERROR_IMPORT_FAILURE, } dari "./errors.js";
biarkan ffmpeg;
const load = async ({ coreURL: _coreURL, wasmURL: _wasmURL, workerURL: _workerURL, }) => {
    konstanta pertama = !ffmpeg;
    mencoba {
        jika (!_coreURL)
            _coreURL = CORE_URL;
        // ketika tipe web worker adalah `classic`.
        imporScripts(_coreURL);
    }
    menangkap {
        jika (!_coreURL)
            _coreURL = CORE_URL.replace('/umd/', '/esm/');
        // ketika tipe web worker adalah `module`.
        self.createFFmpegCore = (await import(
        /* webpackIgnore: true */ /* @vite-ignore */ _coreURL)).default;
        jika (!self.createFFmpegCore) {
            lemparkan ERROR_IMPORT_FAILURE;
        }
    }
    const coreURL = _coreURL;
    const wasmURL = _wasmURL ? _wasmURL : _coreURL.replace(/.js$/g, ".wasm");
    konstanta workerURL = _workerURL
        ?_workerURL
        : _coreURL.replace(/.js$/g, ".worker.js");
    ffmpeg = await self.createFFmpegCore({
        // Memperbaiki kesalahan `Overload resolution failed.` saat menggunakan ffmpeg-core multi-threaded.
        // WasmURL dan workerURL dienkode dalam URL sebagai solusi sementara untuk memperbaiki masalah locateFile.
        mainScriptUrlOrBlob: `${coreURL}#${btoa(JSON.stringify({ wasmURL, workerURL }))}`,
    });
    ffmpeg.setLogger((data) => self.postMessage({ type: FFMessageType.LOG, data }));
    ffmpeg.setProgress((data) => self.postMessage({
        tipe: FFMessageType.PROGRESS,
        data,
    }));
    kembali pertama;
};
const exec = ({ args, timeout = -1 }) => {
    ffmpeg.setTimeout(timeout);
    ffmpeg.exec(...args);
    const ret = ffmpeg.ret;
    ffmpeg.reset();
    kembali ret;
};
const writeFile = ({ path, data }) => {
    ffmpeg.FS.writeFile(path, data);
    kembalikan nilai benar;
};
const readFile = ({ path, encoding }) => ffmpeg.FS.readFile(path, { encoding });
// TODO: periksa apakah penghapusan berhasil.
const deleteFile = ({ path }) => {
    ffmpeg.FS.unlink(path);
    kembalikan nilai benar;
};
const rename = ({ oldPath, newPath }) => {
    ffmpeg.FS.rename(oldPath, newPath);
    kembalikan nilai benar;
};
// TODO: periksa apakah pembuatan berhasil.
const createDir = ({ path }) => {
    ffmpeg.FS.mkdir(path);
    kembalikan nilai benar;
};
const listDir = ({ path }) => {
    const names = ffmpeg.FS.readdir(path);
    const nodes = [];
    untuk (konstanta nama dari nama-nama) {
        const stat = ffmpeg.FS.stat(`${path}/${name}`);
        const isDir = ffmpeg.FS.isDir(stat.mode);
        nodes.push({ name, isDir });
    }
    mengembalikan node;
};
// TODO: periksa apakah penghapusan berhasil.
const deleteDir = ({ path }) => {
    ffmpeg.FS.rmdir(path);
    kembalikan nilai benar;
};
const mount = ({ fsType, options, mountPoint }) => {
    konstanta str = fsType;
    const fs = ffmpeg.FS.filesystems[str];
    jika (!fs)
        kembalikan false;
    ffmpeg.FS.mount(fs, options, mountPoint);
    kembalikan nilai benar;
};
const unmount = ({ mountPoint }) => {
    ffmpeg.FS.unmount(mountPoint);
    kembalikan nilai benar;
};
self.onmessage = async ({ data: { id, type, data: _data }, }) => {
    konstanta trans = [];
    biarkan data;
    mencoba {
        jika (tipe !== FFMessageType.LOAD && !ffmpeg)
            lemparkan ERROR_NOT_LOADED; // eslint-disable-line
        saklar (tipe) {
            kasus FFMessageType.LOAD:
                data = await load(_data);
                merusak;
            kasus FFMessageType.EXEC:
                data = exec(_data);
                merusak;
            kasus FFMessageType.WRITE_FILE:
                data = writeFile(_data);
                merusak;
            kasus FFMessageType.READ_FILE:
                data = readFile(_data);
                merusak;
            kasus FFMessageType.DELETE_FILE:
                data = deleteFile(_data);
                merusak;
            kasus FFMessageType.RENAME:
                data = ganti nama(_data);
                merusak;
            kasus FFMessageType.CREATE_DIR:
                data = createDir(_data);
                merusak;
            kasus FFMessageType.LIST_DIR:
                data = listDir(_data);
                merusak;
            kasus FFMessageType.DELETE_DIR:
                data = deleteDir(_data);
                merusak;
            kasus FFMessageType.MOUNT:
                data = mount(_data);
                merusak;
            kasus FFMessageType.UNMOUNT:
                data = unmount(_data);
                merusak;
            bawaan:
                lemparkan ERROR_UNKNOWN_MESSAGE_TYPE;
        }
    }
    tangkap (e) {
        self.postMessage({
            pengenal,
            tipe: FFMessageType.ERROR,
            data: e.toString(),
        });
        kembali;
    }
    jika (data instanceof Uint8Array) {
        trans.push(data.buffer);
    }
    self.postMessage({ id, type, data }, trans);
};
