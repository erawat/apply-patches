const core = require('@actions/core');
const { GitHub } = require('@actions/github');
const exec = require('@actions/exec');
const path = require('path');

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

    console.log(comparedCommitsResponse);

    if (!Array.isArray(comparedCommitsResponse.data) || !comparedCommitsResponse.data.length) {
     return;
    }

    
   

  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

async function applyPatch (id, diffUrl) {
  try{ 
    await exec.exec(`curl -Ls ${diffUrl} -o ${id}.diff`);
    await exec.exec(`git apply -v ${id}.diff `);
    await exec.exec(`rm ${id}.diff`);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
