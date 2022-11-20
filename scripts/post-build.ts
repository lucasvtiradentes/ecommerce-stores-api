'use strict'

import { join, extname, dirname } from 'path'
import { statSync, readdirSync, copyFileSync, existsSync, mkdirSync } from 'fs'

const SOURCE_FOLDER = "./src"
const DIST_FOLDER = "./build"
const IGNORED_EXTENSIONS = ['.js', '.ts']

copyTypescriptIgnoredFilesToDist(SOURCE_FOLDER, DIST_FOLDER, IGNORED_EXTENSIONS)
console.log("post-build script done ✔️")

/* ========================================================================== */

function copyTypescriptIgnoredFilesToDist(sourceFolder: string, distFolder: string, ignoredExtensionsArr: string[]) {

  const nonJsFilesFromSourceArr = getOnlyAllowedFiles(sourceFolder, ignoredExtensionsArr)
  const copiedFiles = copyFilesToNewFolder(nonJsFilesFromSourceArr, sourceFolder, distFolder)

  console.log(`${copiedFiles} out of ${nonJsFilesFromSourceArr.length} files were copied!`)
  console.log("")

}

function getOnlyAllowedFiles(baseFolderPath: string, extensionsToIgnoreArr: any[], oldFolderContentArr?, oldFilesArr?) {

  const folderContentArr = oldFolderContentArr || readdirSync(baseFolderPath)
  let allowedFilesArr = oldFilesArr || []

  folderContentArr.forEach((file) => {

    const newbase = join(baseFolderPath, file)
    const isFolder = statSync(newbase).isDirectory()

    if (isFolder) {

      allowedFilesArr = getOnlyAllowedFiles(newbase, extensionsToIgnoreArr, readdirSync(newbase), allowedFilesArr)
    } else {
      const curExt = extname(file)
      const extensionIndex = extensionsToIgnoreArr.findIndex(igExt => igExt === curExt)

      if (extensionIndex === -1) { allowedFilesArr.push(newbase) }
    }

  })

  return allowedFilesArr
}

function copyFilesToNewFolder(filesToCopyArr: string[], sourceFolderpath: string, outputBasePath: string) {

  if (!filesToCopyArr || !sourceFolderpath || !outputBasePath) { return 0 }
  if (filesToCopyArr.length === 0) { return 0 }
  if (!existsSync(sourceFolderpath)) { return 0 }

  let copiedFiles = 0

  for (let x = 0; x < filesToCopyArr.length; x++) {

    const currentFile = filesToCopyArr[x]
    const newFilePath = join(outputBasePath, currentFile)

    if (existsSync(currentFile)) {

      const newFolderPath = dirname(newFilePath)
      const doesFolderExist = existsSync(newFolderPath)
      const doesFileExist = existsSync(newFilePath)

      if (doesFileExist) { console.log(`Existente: ${newFilePath}`); continue }
      if (!doesFolderExist) { createFoldersRecursively(newFolderPath) }

      copiedFiles += 1
      copyFileSync(currentFile, newFilePath)
      console.log(`copied: ${newFilePath}`)

    }

  }

  return copiedFiles
}

function createFoldersRecursively(newFolderPath: string) {

  if (!newFolderPath) { return }

  console.log(`Criando pastas recursivas -> ${newFolderPath}`)

  const foldersArr = newFolderPath.split('\\')
  if (foldersArr.length === 0) { return }

  let oldFolder = ""

  for (const folder of foldersArr) {

    const newbase = join("./", oldFolder, folder)
    const doesFolderExist = existsSync(newbase)

    if (!doesFolderExist) {
      mkdirSync(newbase)
    }

    oldFolder = newbase

  }

}
