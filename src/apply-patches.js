const core = require('@actions/core');
const { GitHub } = require('@actions/github');
const exec = require('@actions/exec');
const path = require('path');

async function run() {
  try{
    const [owner, repo] = core.getInput('repo').split('/');
    const version = core.getInput('version');
    const head = version + '-patches';
    const github = new GitHub(process.env.GITHUB_TOKEN);

    console.log(owner);
    console.log(repo);
    const comparedCommitsResponse = await github.repos.compareCommits({
      owner: owner,
      repo: repo,
      base: version,
      head: head,
    });

    console.log(comparedCommitsResponse);

    await applyPatch(comparedCommitsResponse.data.diff_url);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

async function applyPatch (diffUrl) {
  console.log(diffUrl);
  try{ 
    const workingDir = getWorkingDir();
    const patchFile = 'patch.diff';
    await exec.exec(`curl -Ls ${diffUrl} -o ${patchFile}`, null, { cwd: workingDir });
    await exec.exec(`patch -p1 -i ${patchFile}`, null, { cwd: workingDir });
    await exec.exec(`rm ${patchFile}`, null, { cwd: workingDir });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

function getWorkingDir() {
  const workspace = process.env.GITHUB_WORKSPACE;
  const workspacePath = path.resolve(workspace);
  const inputPath  =  core.getInput('path');
  if (!inputPath) {
    return workspacePath;
  }

  return workspacePath + path.sep + inputPath;
}

module.exports = run;
