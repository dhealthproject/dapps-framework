# Contributing to @dhealthdapps/frontend

First off, thank you for considering contributing to @dhealthdapps/frontend. 
It’s people like you that make @dhealthdapps/frontend such a great tool.

@dhealthdapps/frontend is an open source project and we love to receive contributions from 
our community — you! There are many ways to contribute, from writing tutorials or blog 
posts, improving the documentation, submitting bug reports and feature requests or 
writing code which can be incorporated into @dhealthdapps/frontend itself.

Following these guidelines helps to communicate that you respect the time of 
the developers managing and developing this open source project. In return, 
they should reciprocate that respect in addressing your issue, assessing changes, 
and helping you finalize your pull requests.

Please, **don't use the issue tracker for support questions**. 

## Bug reports

If you think you have found a bug in @dhealthdapps/frontend, first make sure that you 
are testing against the latest version of @dhealthdapps/frontend - your issue may already 
have been fixed. If not, search our issues list on GitHub in case a similar 
issue has already been opened.

It is very helpful if you can prepare a reproduction of the bug. In other words, 
provide a small test case which we can run to confirm your bug. It makes it easier to 
find the problem and to fix it.
 
Please, take in consideration the next template to report your issue:

> **Expected Behaviour**\
> Short and expressive sentence explaining what the code should do.\
> **Current Behaviour**\
> A short sentence enplaning what the code does. \
> **Steps to reproduce**\
> For faster issue detection, we would need a step by step description do reproduce the issue.


Provide as much information as you can.

Open a new issue [here](github-issues).

## Feature requests

If you find yourself wishing for a feature that doesn't exist in @dhealthdapps/frontend, 
you are probably not alone. There are bound to be others out there with similar 
needs. Many of the features that @dhealthdapps/frontend has today have been added because 
our users saw the need. Open an [issue](github-issues) on our issues list on GitHub which describes 
the feature you would like to see, why you need it, and how it should work.

## Contributing code and documentation changes

If you have a bugfix or new feature that you would like to contribute to @dhealthdapps/frontend, please find or open an issue 
about it first. Talk about what you would like to do. It may be that somebody is already working on it, or that there 
are particular issues that you should know about before implementing the change.

We enjoy working with contributors to get their code accepted. There are many approaches to fixing a problem and it is 
important to find the best approach before writing too much code.

### Fork and clone the repository

You will need to fork the main @dhealthdapps/frontend code repository and clone 
it to your local machine. See [github help page](https://help.github.com/articles/fork-a-repo/) for help.

### Submitting your changes

Once your changes and tests are ready to submit for review:

1. Test your changes
   
    Run the test suite to make sure that nothing is broken.
    
2. Submit a pull request

    Push your local changes to your forked copy of the repository and [submit a pull request](https://help.github.com/articles/about-pull-requests/). In the pull request, choose a title which sums up the changes that you have made, and in the body provide more details about what your changes do. Also mention the number of the issue where discussion has taken place, eg "Closes #123".
    
Then sit back and wait. There will probably be discussion about the pull request and, if any changes are needed, we would love to work with you to get your pull request merged into @dhealthdapps/frontend.

## <a name="rules"></a> Coding guidelines

To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more specs (unit-tests).
* All public API methods **must be documented**.

### <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the @dhealthdapps/frontend change log**.

#### Commit Message Format

Each commit message consists of a **package**, a **type**, a **scope** and a **subject**:

```
[<package>] <type>(<scope>): <subject>
```

The **package**, the **type** and the **subject** are mandatory. The **scope** of the header is optional.

Optimally, the **subject** should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples:
```
[@dhealthdapps/frontend] docs(changelog): update changelog to v1.0.0-beta7
```
```
[@dhealthdapps/frontend] feat(config): add config field "generationHash"
```

#### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

#### <a name="commit-types"></a> Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: webpack, postcss, tailwind, vue)
* **chore**: Changes that affect the general software package maintenance processes (example scopes: package, build, config)
* **ci**: Changes to our CI configuration files and scripts (example scopes: travis, jenkins)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests

#### <a name="commit-scopes"></a> Scope

The scope should be the name of the module affected.

The following is the list of supported scopes:

* **api**
* **app**
* **base**
* **build**
* **common**
* **config**
* **controls**
* **elements**
* **env**
* **examples**
* **fields**
* **fonts**
* **i18n**
* **kernel**
* **package**
* **widgets**

#### Subject

The subject contains a succinct description of the change(s):

* preferrably, use the imperative, present tense: "change" not "changed"
* don't capitalize the first letter
* no dot (.) at the end

*CONTRIBUTING.md is based on [CONTRIBUTING-template.md](https://github.com/nayafia/contributing-template/blob/master/CONTRIBUTING-template.md)* 
and [elasticsearch/CONTRIGUTING](https://github.com/elastic/elasticsearch/blob/master/CONTRIBUTING.md)

[pull-request]:https://help.github.com/articles/about-pull-requests/
[github-issues]:https://github.com/dhealthproject/dapps-framework/issues