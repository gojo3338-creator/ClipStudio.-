export const ERROR_UNKNOWN_MESSAGE_TYPE = new Error("tipe pesan tidak dikenal");
export const ERROR_NOT_LOADED = new Error("ffmpeg belum dimuat, panggil `await ffmpeg.load()` terlebih dahulu");
export const ERROR_TERMINATED = new Error("memanggil FFmpeg.terminate()");
export const ERROR_IMPORT_FAILURE = new Error("gagal mengimpor ffmpeg-core.js");
