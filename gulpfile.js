const argv = require('yargs').argv;
const archiver = require("archiver");
const {dest, series, src, task} = require("gulp");
const eslint = require("gulp-eslint")
const fs = require("fs");
const moment = require("moment");
const typescript = require("gulp-typescript");
const install = require("gulp-install");

const IGNORED_FILES = ["src", "index.ts", "package-lock.json", "node_modules"]

function getBundlePath(){
    return `./bundle/app`
}
function getGlob(){
    const path = getBundlePath()
    const indexPath = path+"/index.ts"
    if(fs.existsSync(indexPath)){
        return indexPath;
    } else {
        return path+"/src/**/*.ts";
    }
}

function getClientName(){
    const client = argv.client;
    if (client === undefined) throw new Error("Client variable must be set!")
    return client;
}


function lint() {
    return src(getGlob())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function compile() {
    const path = getBundlePath();
    const typescriptProject = typescript.createProject('tsconfig.json', {rootDir: path});
    const tsResult = src(getGlob())
        .pipe(typescriptProject());
    return tsResult.js.pipe(dest(path+"/dist"))
}

async function bundle(done){
    const client = getClientName()
    const path = "./bundle"
    const time = moment().format("YY.MM.DD_HH-mm");
    const filename = `build/coldwave-${client}-${time}.zip`;
    console.log(`Creating bundle "${filename}"`);
    if (!fs.existsSync("./build")) {
        console.log("Creating directory");
        fs.mkdirSync("./build");
    }
    const out = fs.createWriteStream(filename);
    out.addListener("finish", done);
    out.addListener("error", err => done(err));
    const zip = archiver("zip", {
        zlib: { level: 9 } // Compression level
    });
    zip.on('warning', warning => console.warn("Warning during Zip creation...", warning));
    zip.on('error', err => done(err));+
        zip.pipe(out);

    //Default files
    //TODO RECURSIVE (so we can skip files)
    const files = fs.readdirSync(path);
    for(const file of files){
        if(IGNORED_FILES.includes(file)) {
            continue;
        }
        const fileStats =  fs.lstatSync(`${path}/${file}`);
        if(fileStats.isFile()){
            zip.file(`${path}/${file}`, { name: file })
        } else if (fileStats.isDirectory()) {
            zip.directory(`${path}/${file}`, file, undefined)
        }
    }
    await zip.finalize();
}

task("bundle", series(lint, compile, bundle));