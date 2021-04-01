![coverage report](https://gitlab.liu.se/tddd96-grupp11/teknikattan-scoring-system/badges/dev/coverage.svg?job=client:test&key_text=Client+Coverage&key_width=110)
![coverage report](https://gitlab.liu.se/tddd96-grupp11/teknikattan-scoring-system/badges/dev/coverage.svg?job=server:test&key_text=Server+Coverage&key_width=115)

![Lines of Code](http://localhost:9000/api/project_badges/measure?project=TDDD96&metric=ncloc)](http://localhost:9000/dashboard?id=TDDD96)

![Quality Gate Status](http://localhost:9000/api/project_badges/measure?project=TDDD96&metric=alert_status)](http://localhost:9000/dashboard?id=TDDD96)

![Reliability Rating](http://localhost:9000/api/project_badges/measure?project=TDDD96&metric=reliability_rating)](http://localhost:9000/dashboard?id=TDDD96)


# Scoring system for Teknikåttan

This is the scoring system for Teknikåttan!

## Installing

To install the client and server needed to run the application, look in their respective READMEs for intstructions.

## Using

After installing both the client and the server, you are ready to run the application.
This is done in VSCode by pressing `ctrl+shift+b` and running the `Start client and server` task.
The terminals for the client and server will now be seen on the right and left, respectively.
After making a change to either the client or the server while they are running, simply reload the page to see the changes immediately.

## Workflow

You will need to follow the instructions given below to contribute to this project.

### Working on an issue

To begin working, you need to choose an issue and create a branch from it.

1. On GitLab, see this weeks issues by going to `Issues->Milstones` on the left.
2. Open the milestone for the current week.
3. All unstarted issues are shown in the left tab labeled `Unstarted Issues`.
4. Choose one of these issues and click on it.
5. Add yourself as an asignee (in top right corner).
6. Press the little green downarrow on the right of the `Create merge request` button and select and press `Create branch`.
7. Open the project in VSCode.
8. Type `git pull`. This will fetch the new branch you just created.
9. Switch to it by running `git checkout <branch>`. (Example: `git checkout 5-add-login-api`)

You are now ready to start working on your issue.

### Adding a new issue

If there are no more issues for the current or you just found something that needs to be done, you can create your own issue.

1. On GitLab, open `Issues` (on the left).
2. Press the green `New issue` button (in top right corner).
3. Give it an appropriate name, add yourself as an asignee and add the current week as the milestone.
4. Press the green `Submit Issue` (in the bottom left corner).

### Creating a merge request

After solving your issue, you will need to merge your branch into `dev`.
This is done in two steps:
First you need to prepare your branch to be merged and then create a merge request.
First, prepare your branch to be merged.

1. Open the project in VSCode.
2. Checkout your branch, if you are not already on it (`git checkout <branch>`).
3. Run `git pull origin dev`. This will try to merge the latest changes from `dev` into your branch. This can have a few different results:
   - There will be no changes, which is fine.
   - There will be no conflicting changes, which is also fine.
   - There will be conflicting changes, in which case you will need to merge it manually (see Merge conflicts) before continuing to the next step.
4. Run `git push`.

Your branch is now ready to be merged.
The next step is to create the actual merge request.

1. On GitLab open `Repository->Branches`.
2. Find your branch and press `Merge request`.
3. Press `Submit merge request` button (in the bottom the left corner).

A green `Merge` button will appear when all tests have passed (run automatically) and another person has approved your merge request.
You cannot approve your own merge requests but once it's approved anyone can merge.

### Merge conflicts

You will need to manually merge if there is a merge conflict between your branch and another.
This is simply done by opening the project in VSCode and going to the Git tab on the left (git symbol).
You will then see som files marked with `C`, which indicates that there are conflicts in these files.
You will have to go through all of the merge conflicts and solve them in each file.
A merge typically looks like the code snippet at the bottom of this document in plain text (try opening this in VSCode and see how it looks).
The only thing you really need to do is removing the `<<<<<<<`, `=======` and `>>>>>>>` symbols from the document, although you don't have to do it by hand.
In VSCode, you can simply choose if you want to keep incoming changes (from the branch you merging into), current changes (from your branch) or both.
Solve all the merge conflicts in every file and run the tests to make sure it still works.
Commit and push your changes when you are done.

```
<<<<<<< file.txt
<Your changes>
=======
<Changes from dev>
>>>>>>> 123456789:file.txt
```
