![coverage report](https://gitlab.liu.se/tddd96-grupp11/teknikattan-scoring-system/badges/dev/coverage.svg?job=client:test&key_text=Client+Coverage&key_width=110)
![coverage report](https://gitlab.liu.se/tddd96-grupp11/teknikattan-scoring-system/badges/dev/coverage.svg?job=server:test&key_text=Server+Coverage&key_width=115)

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

### Working on an issue

This following steps describe how you choose an issue and create a branch and merge request from it.

1. See all issues by going to `Issues->Boards`.
2. The issues no one has started on yet are showed in the `Open` tab. Choose one of these by dragging it into the `In progress` tab and opening it.
3. Add yourself as an asignee (in top right corner).
4. Add the current week as a milestone to the issue (to the right).
5. Press the little green downarrow on the right of the `Create merge request` button and select and press `Create branch`.
6. Open the project in VSCode.
7. Type `git pull`. This will fetch the new branch you just created and you should see it in the log (Example: `* [new branch] 5-add-login-api -> origin/5-add-login-api`)
8. Switch to it by running `git checkout <issue>-<name>`. (Example: `git checkout 5-add-login-api`)

You are now ready to start working on your issue.

### Creating a merge request

When you have solved the issue and are ready to merge them into the `dev` will have to create a merge request.

1. On GitLab open `Repository->Branches`.
2. Find your branch and press `Merge request`.

You have now create a merge request for your branch.
The next step is to prepare your branch to be merged.

1. Open the project in VSCode.
2. Checkout your branch, if you are not already on it (`git checkout <branch>`).
3. Run `git pull origin dev`. This will try to merge the latest changes from `dev` into your branch. This can have a few different results:
   - There will be no changes, which is fine.
   - There will be no conflicting changes, which is also fine.
   - There will be conflicting changes, in which case you will need to merge it manually (see Merge conflicts) before continuing to the next step.
4. Run `git push`.
5. Go to GitLab and press `Merge Requests`, open your merge request and press the green `Mark as ready` button (in the top righ corner).

The test will then run on your changes in the merge request on GitLab.
You will be allowed to merge once the pipelines have passed and another person has approved your merge request.
When this is done, simply press the `Merge` button.

### Merge conflicts

You will need to manually merge if there is a merge conflict between your branch and another.
This is simply done by opening the project in VSCode and going to the Git tab on the left (git symbol).
You will then see som files marked with `C`, which means that there are conflicts in these files.
Open them one by one and choose if you want to keep incoming changes (from `dev`), current changes (from your branch) or both.
The only thing you really need to do is removing the `<<<`, `===` and `>>>` symbols from the document, although you don't have to do it by hand.
A merge typically looks like the following picture in plain (try opening this in VSCode and see how it looks).
Simply solve all the merge conflicts in every file, run the tests to make sure it still works.
When you are done, simply commit and push your changes.

```
<<<<<<< file.txt
<Your changes>
=======
<Changes from dev>
>>>>>>> 123456789:file.txt
```
