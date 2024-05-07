/**
 * all input/output related functions (side-effect functions)
 * @author sebastien.mamy@gmail.com
 * @since 2021-01-28
 */ 


const fs =              require("fs");
const path =            require("path");
const helper =          require("./oceans.helper");


/** module object */
const io =              {
    sep: path.sep
};


/**
 * read a file and transform it into string
 *@returns        string
 */
io.readFile = (endpoint ="", encoding = "utf8") => !io.fileExists(endpoint) ? helper.log("ERROR", "file does not exists", endpoint) : fs.readFileSync(endpoint, encoding);


/**
 * reads a json file
 * @returns         object
 */
io.readJson = (endpoint = "") => !io.fileExists(endpoint) ? {} : JSON.parse(io.readFile(endpoint));


/**
 * tests if the file exists
 * @returns        boolean
 */
io.fileExists = (...path_elements) => fs.existsSync(io.path(...path_elements));


/** 
 * canonify the path elements
 * @returns        string
 */ 
io.path = (...path_elements) => path.resolve(path_elements.join(path.sep));


/**
 * creates a directory from path elements (recursive)
 * @returns        string
 */
io.makeDir = (...path_elements) => path.resolve(path_elements.join(path.sep)).split(path.sep).reduce(function(result, subpath) {
    result += path.sep + subpath;
    if(!io.fileExists(result)) fs.mkdirSync(result);
    return result;
});


/**
 * writes a file from a data
 * @returns        status
 */
io.writeFile = (data, endpoint, encoding = "utf8") => {
    io.makeDir(endpoint.split(path.sep).slice(0,-1).join(path.sep));
    switch((endpoint.split(".")[endpoint.split(".").length - 1]).toLowerCase()) {
        case "json":
            return fs.writeFileSync(endpoint, JSON.stringify(data), encoding);
        case "txt":
            return fs.writeFileSync(endpoint, data.join("\n"), encoding);
        case "data":
        case "html":
        case "md":
            return fs.writeFileSync(endpoint, data, encoding);
        default:
            helper.exception("unknown file type error", endpoint, data);
    }
}


/**
 * copy or overwrite src in dest
 * @returns         undefined
 */
io.copyFile = (src, dest) => fs.copyFileSync(io.path(src), io.path(dest));


/**
 * apply a function to all file of a directory
 * @returns         void
 */
io.reduce = (dir, func, extension = "*") => {
    for(let file of fs.readdirSync(dir)) if(extension === "*" || extension === path.extname(file)) func(file);
}


/**
 * list of the files of a directory
 * @param {object} params {path: string, options: F | D }
 * @returns the list of files in the given directory
 */
io.ls = (params) => !params?.path ? null :
                    params?.options === "D" ? fs.readdirSync(params.path, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name) :
                    params?.options === "F" ? fs.readdirSync(params.path, { withFileTypes: true }).filter(dirent => !dirent.isDirectory()).map(dirent => dirent.name) : 
                    fs.readdirSync(params.path, { withFileTypes: true }).map(dirent => dirent.name);


/**
 * checks if a path is a directory
 * @param {string} path 
 * @returns true if the path points to a directory
 */
io.isDirectory = (path) => fs.lstatSync(path).isDirectory();


/**
 * count the files of a given path, recursivly or not
 * @param   {object}    params {path: string, options: R}
 * @return  {number}    the number of files
 */
io.countFiles = (params) => {
    if(!params?.path)           return 0;
    let count =                 fs.readdirSync(params?.path).filter(dirent => !io.isDirectory(params.path + io.sep + dirent)).length;
    if(params?.options !== "R") return count;
    return                      fs.readdirSync(params?.path).filter(dirent => io.isDirectory(params.path + io.sep + dirent)).reduce((out, dirent) => out + io.countFiles({path: params.path + io.sep + dirent, options: params.options}), count);
}


/** export the module for node */
if(undefined !== module) module.exports = io;