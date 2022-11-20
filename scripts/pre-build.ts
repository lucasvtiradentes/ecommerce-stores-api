'use strict'

import { existsSync, rmSync } from 'fs'

const DIST_FOLDER = "./build"

if (existsSync(DIST_FOLDER)) {
  console.log("old dist folder was deleted!")
  rmSync(DIST_FOLDER, { recursive: true })
}

console.log("pre-build script done ✔️")
