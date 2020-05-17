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
    const inputBase = core.getInput('base', { required: false });
    
    const inputState = core.getInput('state', { required: false });
    const state = inputState != '' ? inputState : 'all';

    const github = new GitHub(process.env.GITHUB_TOKEN);
    const pullRequestsResponse = await github.pulls.list({
      owner: inputOwner,
      repo: inputRepo,
      base: inputBase,
      state: state,
    });

   const pullRequests = pullRequestsResponse.data;
   if (!Array.isArray(pullRequests) || !pullRequests.length) {
    throw new Error('No Pull Requests found');
   }

   pullRequests.forEach(function (data) {
    const { id, patch_url: patchUrl } = data;
    applyPatch(id, patchUrl, toPatchDir);
   });

  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

async function applyPatch (id, patchUrl, workingDir) {
  console.log(id);
  console.log(patchUrl);
  console.log(workingDir);
  try{
    await exec.exec(`curl -Ls ${patchUrl} > ${id}.patch`, null, { cwd: workingDir });
    await exec.exec(`ls -la`, null, { cwd: workingDir });
    await exec.exec(`patch -p1 -i ${id}.patch`, null, { cwd: workingDir });
    await exec.exec(`rm ${id}.patch`, null, { cwd: workingDir });
  }
  catch (error) {
    core.setFailed(error.message);
  }
 

}

module.exports = run;
