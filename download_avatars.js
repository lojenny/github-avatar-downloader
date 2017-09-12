require('dotenv').config();
var request = require('request');
var fs = require('fs');

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

  if (!repoOwner || !repoName){
    console.log('Need to enter repository owner and name as arguments.');
    return;
  }

  const options = getOptionsForRepo(repoOwner, repoName);

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
      return;
    }

    const data = JSON.parse(body);

    let contributorName = [];
    let contributorUrl = [];

    data.forEach(contributor => {
      contributorName.push(contributor.login);
      contributorUrl.push(contributor.avatar_url);
    });

    cb(contributorName, contributorUrl);

  });
}

function downloadImageByURL(url, filePath) {

  if (!fs.existsSync('./avatars')){
    fs.mkdirSync('./avatars');
  }

  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log('Response Status Code: ', response.statusCode);
    })
    .on('end', () => {
      console.log('Download Completed.');
    })
    .pipe(fs.createWriteStream(filePath));

}


getRepoContributors(process.argv[2], process.argv[3], function (name, url) {

  for (let i = 0; i < name.length; i++) {
    downloadImageByURL(url[i], `./avatars/${name[i]}.png`);
  }
});



