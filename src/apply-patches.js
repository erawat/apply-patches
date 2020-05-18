const core = require('@actions/core');
const { GitHub } = require('@actions/github');
const exec = require('@actions/exec');
const path = require('path')

async function run() {

  try{

    const inputOwner = core.getInput('owner', { required: true });
    const inputRepo = core.getInput('repo', { required: true });
    const inputHead = core.getInput('head', { required: true });
    const inputBase = core.getInput('base', { required: true });

    const github = new GitHub(process.env.GITHUB_TOKEN);
    const comparedCommitsResponse = await github.repos.compareCommits({
      owner: inputOwner,
      repo: inputRepo,
      base: inputBase,
      head: inputHead,
    });
    applyPatch(comparedCommitsResponse.data.diff_url);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

function getWorkingDir() {
  const workspace = process.env.GITHUB_WORKSPACE;
  const workspacePath = path.resolve(workspace);

  const inputPath  =  core.getInput('path', {required: false});

  return workspacePath + path.sep + inputPath;

}

async function applyPatch (diffUrl) {
  console.log(diffUrl);
  try{ 
    const workingDir = getWorkingDir();
    const patchFile = 'patch.diff';
    await exec.exec(`curl -Ls ${diffUrl} -o ${patchFile}`, null, { cwd: workingDir });
    await exec.exec(`pwd`), null, { cwd: workingDir };
    await exec.exec(`patch -p1 -i ${patchFile}`, null, { cwd: workingDir });
    await exec.exec(`rm ${patchFile}`, null, { cwd: workingDir });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
