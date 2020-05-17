const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const path = require('path');

async function run() {

  try{
    const workspace = process.env.GITHUB_WORKSPACE;
    const workspacePath = path.resolve(workspace);

    const inputToPatchDir =  core.getInput('to_path_dir', {required: false});
    const toPatchDir = inputToPatchDir != '' ? workspacePath + path.sep + toPatchDir : workspacePath;

    console.log(workspacePath);
    console.log(toPatchDir);

    const inputOwner = core.getInput('owner', { required: true });
    const inputRepo = core.getInput('repo', { required: true });
    const inputBase = core.getInput('base', { required: false });
    const inputState = core.getInput('state', { required: false });
    console.log(workspacePath);
    console.log(toPatchDir);
    
    const state = inputState != '' ? inputState : 'all';

    console.log(state);

    const github = new GitHub(process.env.GITHUB_TOKEN);
    const pullRequests = await github.pulls.list({
      owner: inputOwner,
      repo: inputRepo,
      base: inputBase,
      state: state,
    });

    //if (pullRequests.data === '') {
    //  throw new Error ('no pull requests found');
   // }

    console.log(pullRequests);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
