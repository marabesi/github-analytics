#!/bin/bash

remote_repo=${REPO_URL:-`git config remote.origin.url`}
remote_branch="gh-pages"

rm -fr .git && \
cd dist && \
git init && \
git config user.name "$GIT_NAME" && \
git config user.email "$GIT_EMAIL" && \
git add -f . && \
git commit -m 'build' && \
git push --force $remote_repo master:$remote_branch && \
rm -fr .git