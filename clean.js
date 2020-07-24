const del = require('del');

(async () => {
  const deletePaths = await del(['./public', './db.json', './.deploy_git']);
  console.log(deletePaths);
})();
