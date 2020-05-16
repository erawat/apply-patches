const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function run() {

  try{
    const workspace = process.env.GITHUB_WORKSPACE;
    const owner = core.getInput('repo_owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const branch = core.getInput('branch', { required: false }) === 'true';

    const github = new GitHub(process.env.GITHUB_TOKEN);
    const pullRequests = await github.pull.list({
      owner: owner,
      repo: repo,
      base: branch,
      mediaType: {
        format: "diff"
      }
    });
    console.log(pullRequests);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
