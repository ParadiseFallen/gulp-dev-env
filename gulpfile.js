//#region imports
import fileMap from './filemap.js'
import gulp from 'gulp'
import pug from 'gulp-pug'
// * Support for @@include and loops. simple html preprocessor
// ? https://www.npmjs.com/package/gulp-file-include
import fileInclude from 'gulp-file-include' 
import sourcemaps from 'gulp-sourcemaps'
import sass from 'gulp-sass'
import autoPrefixer from 'gulp-autoprefixer'
import mediaGroup from 'gulp-group-css-media-queries'
import cleanCss from 'gulp-clean-css'
import stripComments from 'gulp-strip-comments'
import clean from 'gulp-clean'
import image from 'gulp-image'
import rename from 'gulp-rename'

const { src, dest, task, parallel, series, watch } = gulp


const lastArgument = process.argv[process.argv.length - 1];
const isReleaseBuild = lastArgument == '-r' || lastArgument == '-release'
console.log(`\tIs release build : ${isReleaseBuild}. To enable add -r or -release \n\tas last flag`)
//#endregion

// ! build pug pages
async function buildPugPages() {
    let pipeline = src(`${fileMap.src.pages}/**/!(_*).pug`)
    pipeline
        .pipe(pug({
            "pretty": true
        }))
        .pipe(stripComments())
        .pipe(dest(`${fileMap.build.pages}/`))
    return pipeline
}

// ! build html pages
async function buildHtmlPages() {
    src(`${fileMap.src.pages}/**/!(_*).html`)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(stripComments())
        .pipe(dest(`${fileMap.build.pages}/`))
}

//#region  TASKS

// * Show filemap that will use gulp
task('filemap', async () => {
    console.log(fileMap)
})

//#region BUILD

// * Build development 
task('build-pages', parallel(buildPugPages, buildHtmlPages))

task('build-styles', () => {
    return src(`${fileMap.src.styles}/!(_*).+(scss|sass)`)
        .pipe(sourcemaps.init())
        .pipe(sass({
            "indentWidth": "4",
            "outputStyle": "expanded"
        }).on('error', sass.logError))
        .pipe(autoPrefixer({
            "cascade": true,
            "overrideBrowserslist": ["last 5 versions"]
        }))
        .pipe(stripComments())
        .pipe(mediaGroup())
        .pipe(cleanCss())
        .pipe(sourcemaps.write('./'))
        .pipe(dest(fileMap.build.styles))
})

task('build-scripts', () => {
    return src(`${fileMap.src.scripts}/!(_*).+(js|ts)`)
        .pipe(stripComments())
        .pipe(dest(fileMap.build.scripts))
})

task('build-img', () =>
    src(`${fileMap.src.img}/**/*.+(png|jpg|gif|ico|svg|webp)`)
        .pipe(image())
        .pipe(dest(fileMap.build.img))
)

task('build-fonts', () =>
    src(`${fileMap.src.fonts}/**/*`)
        .pipe(dest(fileMap.build.fonts))
)

task('default', parallel('build-styles', 'build-pages', 'build-scripts', 'build-img'))
//#endregion

//#region Watch

// * Watch only styles .sccs .sass files
task('watch-styles', () => {
    watch(`${fileMap.src.styles}/**/*.+(scss|sass)`, series('build-styles'))
})

// * Watch only pages .pug .html files
task('watch-pages', () => {
    watch(`${fileMap.src.pages}/**/*.+(html|pug)`, series('build-pages'))
})
// * Watch only pages .pug .html files
task('watch-scripts', () => {
    watch(`${fileMap.src.scripts}/**/*.+(js|ts)`, series('build-scripts'))
})
// * Watch only pages .pug .html files
task('watch-img', () => {
    watch(`${fileMap.src.img}/**/*.+(png|jpg|gif|ico|svg|webp)`, series('build-img'))
})

// * Watch only pages .pug .html files
task('watch-fonts', () => {
    watch(`${fileMap.src.fonts}/**/*`, series('build-fonts'))
})

// * Watch full project
task('watch', parallel('watch-styles', 'watch-pages', 'watch-scripts', 'watch-img'))

//#endregion

//#region Clean

task('clean-pages', () =>
    src(`${fileMap.build.pages}/**/*`)
        .pipe(clean()))

task('clean-styles', () =>
    src(`${fileMap.build.styles}/**/*`)
        .pipe(clean()))

task('clean-scripts', () =>
    src(`${fileMap.build.scripts}/**/*`)
        .pipe(clean()))

task('clean-fonts', () =>
    src(`${fileMap.build.fonts}/**/*`)
        .pipe(clean()))

task('clean-img', () =>
    src(`${fileMap.build.img}/**/*`)
        .pipe(clean()))

task('clean-all', () =>
    src(`${fileMap.build.folder}/*`)
        .pipe(clean()))

//#endregion

//#endregion