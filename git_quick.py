import os
from git import Repo

try:
    git_path = os.getcwd()
    repo = Repo(git_path)
    assert not repo.bare


    repo.index.add('*')
    commit_message = "Auto commit"
    repo.index.commit(commit_message)

    repo.git.push('origin', 'master')
    print("It is done!")
except Exception as e:
    print(f"An error occurred: {e}")