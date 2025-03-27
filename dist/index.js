var $kM5ZL$fs = require("fs");
var $kM5ZL$path = require("path");
var $kM5ZL$actionscore = require("@actions/core");
var $kM5ZL$actionsexec = require("@actions/exec");
var $kM5ZL$jsonbumper = require("json-bumper");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}





const $06220180398b8211$export$52f84dc7de3cd4b8 = async (fileName, options)=>{
    if (fileName === "package.json") try {
        return await $kM5ZL$jsonbumper("package-lock.json", options);
    } catch (error) {
        console.log(error);
    }
    return await $kM5ZL$jsonbumper(fileName, options);
};


const $a800de2af34e93db$var$getVersion = async ()=>{
    const filePath = process.env.VERSION_FILE_PATH || './package.json';
    const absolutePath = (0, ($parcel$interopDefault($kM5ZL$path))).resolve(process.cwd(), filePath);
    const fileContent = await (0, ($parcel$interopDefault($kM5ZL$fs))).promises.readFile(absolutePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    return jsonData.version;
};
const $a800de2af34e93db$var$run = async ()=>{
    const fileName = process.env.VERSION_FILE_NAME || 'package.json';
    const entry = process.env.VERSION_ENTRY || 'version';
    const githubUser = process.env.GITHUB_USER || 'GitHub Version Bumper';
    const githubEmail = process.env.GITHUB_EMAIL || 'github-version-bumper@users.noreply.github.com';
    const githubWorkspace = process.env.GITHUB_WORKSPACE;
    const commitMessage = 'v';
    const currentVersion = await $a800de2af34e93db$var$getVersion();
    console.log(`Version ${currentVersion}`);
    try {
        // MAKE SAFE
        await $kM5ZL$actionsexec.exec('git', [
            'config',
            '--global',
            '--add',
            'safe.directory',
            `${githubWorkspace}`
        ]);
        // SET USER
        await $kM5ZL$actionsexec.exec('git', [
            'config',
            'user.name',
            `"${githubUser}"`
        ]);
        await $kM5ZL$actionsexec.exec('git', [
            'config',
            'user.email',
            `"${githubEmail}"`
        ]);
        let ignoreBump = false;
        const currentBranch = /refs\/[a-zA-Z]+\/(.*)/.exec(process.env.GITHUB_REF)?.[1];
        await $kM5ZL$actionsexec.exec('git', [
            'checkout',
            currentBranch
        ]);
        // Getting last commit information
        const lastCommit = JSON.stringify(await $kM5ZL$actionsexec.exec('git', [
            'log',
            '-1'
        ])).toLowerCase() || '';
        console.log('lastcommitmessage', lastCommit);
        // Bumping Starts
        if (currentBranch === 'master') {
            if (lastCommit.toLowerCase().includes('ci-ignore')) {
                console.log('ci-ignore');
                ignoreBump = true;
            } else if (lastCommit.toLowerCase().includes('ci-version=')) {
                const splitted = lastCommit.toLowerCase().split('ci-version=\\"');
                const replace = splitted[1].split('\\"')[0];
                console.log('replace:', replace);
                await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName, {
                    replace: replace,
                    entry: entry
                });
            } else if (lastCommit.toLowerCase().includes('ci-pre=')) {
                console.log('pre');
                const splitted = lastCommit.toLowerCase().split('ci-pre=\\"');
                const pre = splitted[1].split('\\"')[0];
                console.log('pre:', pre);
                await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName, {
                    pre: pre,
                    entry: entry
                });
            } else if (lastCommit.toLowerCase().includes('ci-major')) {
                console.log('major');
                await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName, {
                    major: true,
                    entry: entry
                });
            } else if (lastCommit.toLowerCase().includes('ci-minor')) {
                console.log('minor');
                await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName, {
                    minor: true,
                    entry: entry
                });
            } else {
                console.log('patch');
                await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName);
            }
        } else if (currentBranch === 'staging' || currentBranch === 'qc' || currentBranch === 'production') {
            console.log('current branch is:', currentBranch);
            console.log('entry:', entry);
            const bumpedBranch = await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName);
            if (bumpedBranch.original.includes('rc')) {
                let branchVersion = bumpedBranch.original.split('-rc.')[1];
                branchVersion++;
                const str2 = bumpedBranch.original.slice(0, -1) + branchVersion;
                await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName, {
                    replace: str2
                });
            } else {
                const vO = bumpedBranch.original;
                const pre = '-rc.0';
                const replace = vO.concat(pre);
                await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName, {
                    replace: replace
                });
            }
        } else if (currentBranch === 'alpha') {
            const bumpedBranch = await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName);
            if (bumpedBranch.original.includes('pr')) {
                let branchVersion = bumpedBranch.original.split('-pr.')[1];
                branchVersion++;
                const str2 = bumpedBranch.original.slice(0, -1) + branchVersion;
                await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName, {
                    replace: str2
                });
            } else {
                const vO = bumpedBranch.original;
                const pre = '-pr.0';
                const replace = vO.concat(pre);
                await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName, {
                    replace: replace
                });
            }
        } else {
            console.log('default environment: bump version');
            await (0, $06220180398b8211$export$52f84dc7de3cd4b8)(fileName);
        }
        if (!ignoreBump) {
            const newVersion = await $a800de2af34e93db$var$getVersion();
            console.log('-newVersion', newVersion);
            await $kM5ZL$actionsexec.exec('git', [
                'commit',
                '-a',
                '-m',
                `ci: ${commitMessage}${newVersion}`
            ]);
            // PUSH THE CHANGES
            const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
            await $kM5ZL$actionsexec.exec('git', [
                'pull',
                '--tags'
            ]);
            await $kM5ZL$actionsexec.exec('git', [
                'tag',
                newVersion
            ]);
            await $kM5ZL$actionsexec.exec('git', [
                'push',
                remoteRepo,
                '--follow-tags'
            ]);
            await $kM5ZL$actionsexec.exec('git', [
                'push',
                remoteRepo,
                '--tags'
            ]);
        }
    } catch (e) {
        $kM5ZL$actionscore.error(`${e}`);
        $kM5ZL$actionscore.setFailed('Failed to bump version');
    }
    $kM5ZL$actionscore.info('Version bumped!');
};
$a800de2af34e93db$var$run();


