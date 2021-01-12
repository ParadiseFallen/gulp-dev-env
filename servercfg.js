import fileMap from './filemap.js'
//* https://browsersync.io/docs/options
export default
    {
        "server":
        {
            baseDir: `${fileMap.build.folder}/`,
        },
        "files": `${fileMap.build.folder}/**/*.*`,
        serveStatic: ['./**/*.*', './build'],
    }