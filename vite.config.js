const isCodeSandbox = !!process.env.SANDBOX_URL
import path from 'path';
export default {
    root: "src/",
    publicDir: "../static",
    base: "./",
    server:
    {
        host: true,
        open: !isCodeSandbox
    },
    build:
    {
        outDir: "../dist",
        emptyOutDir: true,
        sourcemap: true
    }
}