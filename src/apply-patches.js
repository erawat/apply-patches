const core = require('@actions/core');
const { GitHub } = require('@actions/github');
const exec = require('@actions/exec');
const fs = require('fs')

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
    applyPatch(comparedCommitsResponse.data.diff_url);

  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

async function applyPatch (diffUrl) {
  console.log(diffUrl);
  try{ 
    let patchFile = 'fork-patch.diff';
    await exec.exec(`curl -Ls ${diffUrl} -o ${patchFile}`);
    await exec.exec(`git apply -v ${patchFile}`);
    await exec.exec(`rm ${patchFile}`);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
