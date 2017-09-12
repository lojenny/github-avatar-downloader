require('dotenv').config();
var request = require('request');

function getOptionsForRepo(person, repo){
  return {
    url: `https://api.github.com/repos/${person}/${repo}/contributors`,
    qs: {
      sort: 'pushed',
      access_token: process.env.GITHUB_TOKEN
    },
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
}

function getRepoContributors(repoOwner, repoName, cb) {

  const options = getOptionsForRepo(repoOwner, repoName);

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
      return;
    }

    const data = JSON.parse(body);

    data.forEach((contributor) => {
      console.log(contributor.login, contributor.avatar_url);
    });

    return data;
  });

}


getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});
