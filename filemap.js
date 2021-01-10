const projectPath = './project'                                 //* path to project  
const srcFolder = `${projectPath}/src`                          //* src folder
const buildFolder = `${projectPath}/build`                                                
const mainScript = 'main.js'                                    

export default {
    "build": {
        "folder": buildFolder,
        "pages":`${buildFolder}/pages`,
        "styles": `${buildFolder}/styles`,
        "scripts": `${buildFolder}/scripts`,
        "img": `${buildFolder}/img`,
        "fonts": `${buildFolder}/fonts`
    },
    "src": {
        "folder": srcFolder,
        "pages": `${srcFolder}/pages`,
        "styles": `${srcFolder}/styles`,
        "scripts": `${srcFolder}/scripts`,
        "img": `${srcFolder}/img`,
        "fonts": `${srcFolder}/fonts/*.ttf`
    },
    "clean": buildFolder
}