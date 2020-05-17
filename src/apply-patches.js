const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
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

   const data = pullRequestsResponse.data;
   if (!Array.isArray(data) || !data.length) {
    throw new Error('No Pull Request found');
   }

  

    //const {
    //  data: { id: prID, diff_url: diffUrl, patch_url: patch_url }
    //} = pullRequestsResponse.data;

    console.log(data);
    ;

  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
