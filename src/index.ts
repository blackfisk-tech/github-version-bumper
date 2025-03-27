import fs from 'fs'
import path from 'path'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { bumpVersion } from './helpers/bumper'

const getVersion = async () => {
  const filePath = process.env.VERSION_FILE_PATH || './package.json'
  const absolutePath = path.resolve(process.cwd(), filePath)
  const fileContent = await fs.promises.readFile(absolutePath, 'utf8')
  const jsonData = JSON.parse(fileContent)
  return jsonData.version
}
const run = (async () => {
  const fileName = process.env.VERSION_FILE_NAME || 'package.json'
  const entry = process.env.VERSION_ENTRY || 'version'
  const githubUser = process.env.GITHUB_USER || 'GitHub Version Bumper'
  const githubEmail =
      process.env.GITHUB_EMAIL || 'github-version-bumper@users.noreply.github.com'
  const githubWorkspace = process.env.GITHUB_WORKSPACE

  const commitMessage = 'v'

  const currentVersion = await getVersion()

  console.log(`Version ${currentVersion}`)

  try {
    // MAKE SAFE
    await exec.exec('git', [
      'config',
      '--global',
      '--add',
      'safe.directory',
      `${githubWorkspace}`,
    ])
    // SET USER
    await exec.exec('git', [
      'config',
      'user.name',
      `"${githubUser}"`,
    ])
    await exec.exec('git', [
      'config',
      'user.email',
      `"${githubEmail}"`,
    ])
    let ignoreBump = false

    const currentBranch = /refs\/[a-zA-Z]+\/(.*)/.exec(
        process.env.GITHUB_REF as string,
    )?.[1] as string

    await exec.exec('git', ['checkout', currentBranch])

    // Getting last commit information
    const lastCommit =
        JSON.stringify(await exec.exec('git', ['log', '-1'])).toLowerCase() || ''

    console.log('lastcommitmessage', lastCommit)

    // Bumping Starts
    if (currentBranch === 'master') {
      if (lastCommit.toLowerCase().includes('ci-ignore')) {
        console.log('ci-ignore')
        ignoreBump = true
      } else if (lastCommit.toLowerCase().includes('ci-version=')) {
        const splitted = lastCommit.toLowerCase().split('ci-version=\\"')
        const replace = splitted[1].split('\\"')[0]
        console.log('replace:', replace)
        await bumpVersion(fileName, { replace, entry })
      } else if (lastCommit.toLowerCase().includes('ci-pre=')) {
        console.log('pre')
        const splitted = lastCommit.toLowerCase().split('ci-pre=\\"')
        const pre = splitted[1].split('\\"')[0]
        console.log('pre:', pre)
        await bumpVersion(fileName, { pre, entry })
      } else if (lastCommit.toLowerCase().includes('ci-major')) {
        console.log('major')
        await bumpVersion(fileName, { major: true, entry })
      } else if (lastCommit.toLowerCase().includes('ci-minor')) {
        console.log('minor')
        await bumpVersion(fileName, { minor: true, entry })
      } else {
        console.log('patch')
        await bumpVersion(fileName)
      }
    } else if (currentBranch === 'staging' || currentBranch === 'qc' || currentBranch === 'production') {
      console.log('current branch is:', currentBranch)
      console.log('entry:', entry)
      const bumpedBranch = await bumpVersion(fileName)

      if (bumpedBranch.original.includes('rc')) {
        let branchVersion = bumpedBranch.original.split('-rc.')[1]
        branchVersion++
        const str2 = bumpedBranch.original.slice(0, -1) + branchVersion
        await bumpVersion(fileName, { replace: str2 })
      } else {
        const vO = bumpedBranch.original
        const pre = '-rc.0'
        const replace = vO.concat(pre)
        await bumpVersion(fileName, { replace })
      }
    } else if (currentBranch === 'alpha') {
      const bumpedBranch = await bumpVersion(fileName)

      if (bumpedBranch.original.includes('pr')) {
        let branchVersion = bumpedBranch.original.split('-pr.')[1]
        branchVersion++
        const str2 = bumpedBranch.original.slice(0, -1) + branchVersion
        await bumpVersion(fileName, { replace: str2 })
      } else {
        const vO = bumpedBranch.original
        const pre = '-pr.0'
        const replace = vO.concat(pre)
        await bumpVersion(fileName, { replace })
      }
    } else {
      console.log('default environment: bump version')
      await bumpVersion(fileName)
    }

    if (!ignoreBump) {
      const newVersion = await getVersion()
      console.log('-newVersion', newVersion)
      await exec.exec('git', [
        'commit',
        '-a',
        '-m',
        `ci: ${commitMessage}${newVersion}`,
      ])

      // PUSH THE CHANGES
      const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`
      await exec.exec('git', ['pull', '--tags'])
      await exec.exec('git', ['tag', newVersion])
      await exec.exec('git', ['push', remoteRepo, '--follow-tags'])
      await exec.exec('git', ['push', remoteRepo, '--tags'])
    }
  } catch (e) {
    core.error(`${e}`)
    core.setFailed('Failed to bump version')
  }
  core.info('Version bumped!')
})
run()