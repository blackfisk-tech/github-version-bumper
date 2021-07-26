const bump = require('json-bumper')

export const bumpVersion = async (fileName: string, options?: object) => {
 return await bump(fileName, options)
  if (fileName === 'package.json') {
    try {
     return await bump('package-lock.json', options)
    } catch (error) {
      console.log(error)
    }
  }
}
