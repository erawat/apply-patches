const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const path = require('path');

async function run() {

  try{
    const workspace = process.env.GITHUB_WORKSPACE;
    const workspacePath = path.resolve(workspace);
    const toPatchDir =  workspacePath + path.sep + core.getInput('to_path_dir', {required: false});
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const base = core.getInput('base', { required: false });
    const state = core.getInput('state', { required: false });
    //const toPatchDir = core.getInput('to_path_dir', { required: false} === path.resolve(workspace));
    console.log(workspacePath);
    console.log(toPatchDir);
    console.log(state);

    

    const github = new GitHub(process.env.GITHUB_TOKEN);
    const pullRequests = await github.pulls.list({
      owner: owner,
      repo: repo,
      base: base,
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
