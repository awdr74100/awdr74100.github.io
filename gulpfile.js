const gulp = require('gulp');
const del = require('del');

const cleanTask = () => {
  return del(['./public', './db.json', './.deploy_git']);
};

exports.default = cleanTask;
