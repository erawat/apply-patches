const core = require('@actions/core');
const { GitHub } = require('@actions/github');
const exec = require('@actions/exec');
const path = require('path');

async function run() {

  try{
    const workspace = process.env.GITHUB_WORKSPACE;
    const workspacePath = path.resolve(workspace);

    const inputToPatchDir =  core.getInput('to_patch_dir', {required: false});
    const toPatchDir = inputToPatchDir != '' ? workspacePath + path.sep + inputToPatchDir : workspacePath;

    const inputOwner = core.getInput('owner', { required: true });
    const inputRepo = core.getInput('repo', { required: true });
    const inputHead = core.getInput('head', { required: true });
    const inputBase = core.getInput('base', { required: true });

   // const inputPattchesBranch = core.getInput('patchesBranch', { required: false });

    const github = new GitHub(process.env.GITHUB_TOKEN);
    const comparedCommits = await github.repos.compareCommits({
      owner: inputOwner,
      repo: inputRepo,
      base: inputBase,
      head: inputHead,
    });

    console.log(comparedCommits);
  
    /*const pullRequestsResponse = await github.pulls.list({
      owner: inputOwner,
      repo: inputRepo,
      base: inputBranch,
      state: state,
    });

   const pullRequests = pullRequestsResponse.data;
   if (!Array.isArray(pullRequests) || !pullRequests.length) {
    throw new Error('No Pull Requests found');
   }

   pullRequests.forEach(function (data) {
    const { id, diff_url: diffUrl } = data;
    console.log(diffUrl);
    applyPatch(id, diffUrl, toPatchDir);
   });*/

  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

async function applyPatch (id, diffUrl, workingDir) {
  try{ 
    await exec.exec(`curl -Ls ${diffUrl} -o ${id}.diff`, null, { cwd: workingDir });
    await exec.exec(`git apply -v ${id}.diff `, null, { cwd: workingDir });
    await exec.exec(`rm ${id}.diff`, null, { cwd: workingDir });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
