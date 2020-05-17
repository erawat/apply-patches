const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function run() {

  try{
    const workspace = process.env.GITHUB_WORKSPACE;
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const base = core.getInput('base', { required: true });

    const github = new GitHub(process.env.GITHUB_TOKEN);
    const pullRequests = await github.pulls.list({
      owner: owner,
      repo: repo,
      base: base,
      state: 'closed',
    });
    console.log(pullRequests);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
