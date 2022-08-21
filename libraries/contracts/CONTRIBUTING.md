# Contributing to @dhealthdapps/framework

First off, thank you for considering contributing to @dhealthdapps/framework. 
It’s people like you that make @dhealthdapps/framework such a great tool.

@dhealthdapps/framework is an open source project and we love to receive contributions from 
our community — you! There are many ways to contribute, from writing tutorials or blog 
posts, improving the documentation, submitting bug reports and feature requests or 
writing code which can be incorporated into @dhealthdapps/framework itself.

Following these guidelines helps to communicate that you respect the time of 
the developers managing and developing this open source project. In return, 
they should reciprocate that respect in addressing your issue, assessing changes, 
and helping you finalize your pull requests.

Please, **don't use the issue tracker for support questions**.

- [Bug reports](#bug-reports)
- [Feature requests](#feature-requests)
- [Contributing code](#contributing-code-and-documentation-changes)
- [Coding guidelines](#rules)
- [Commit types](#commit-types)
- [Commit scopes](#commit-scopes)
- [Project status](#project-status)

## Bug reports

If you think you have found a bug in @dhealthdapps/framework, first make sure that you 
are testing against the latest version of @dhealthdapps/framework - your issue may already 
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

If you find yourself wishing for a feature that doesn't exist in @dhealthdapps/framework, 
you are probably not alone. There are bound to be others out there with similar 
needs. Many of the features that @dhealthdapps/framework has today have been added because 
our users saw the need. Open an [issue](github-issues) on our issues list on GitHub which describes 
the feature you would like to see, why you need it, and how it should work.

## Contributing code and documentation changes

If you have a bugfix or new feature that you would like to contribute to @dhealthdapps/framework, please find or open an issue 
about it first. Talk about what you would like to do. It may be that somebody is already working on it, or that there 
are particular issues that you should know about before implementing the change.

We enjoy working with contributors to get their code accepted. There are many approaches to fixing a problem and it is 
important to find the best approach before writing too much code.

### Fork and clone the repository

You will need to fork the main @dhealthdapps/framework code repository and clone 
it to your local machine. See [github help page](https://help.github.com/articles/fork-a-repo/) for help.

### Submitting your changes

Once your changes and tests are ready to submit for review:

1. Test your changes
   
    Run the test suite to make sure that nothing is broken.
    
2. Submit a pull request

    Push your local changes to your forked copy of the repository and [submit a pull request](https://help.github.com/articles/about-pull-requests/). In the pull request, choose a title which sums up the changes that you have made, and in the body provide more details about what your changes do. Also mention the number of the issue where discussion has taken place, eg "Closes #123".
    
Then sit back and wait. There will probably be discussion about the pull request and, if any changes are needed, we would love to work with you to get your pull request merged into @dhealthdapps/framework.

## <a name="rules"></a> Coding guidelines

To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more specs (unit-tests).
* All public API methods **must be documented**.

### <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the @dhealthdapps/framework change log**.

#### Commit Message Format

Each commit message consists of a **package**, a **type**, a **scope** and a **subject**:

```
[<package>] <type>(<scope>): <subject>
```

The **package**, the **type** and the **subject** are mandatory. The **scope** of the header is optional.

Optimally, the **subject** should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples:
```
[@dhealth/contracts] docs(changelog): update changelog to v1.0.0-beta7
```
```
[@dhealth/contracts] feat(elements): add new component DappButton
```

#### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

#### <a name="commit-types"></a> Type

Must be one of the following (order is: alphabetically):

* **build**: Changes that affect the build system or external dependencies (example scopes: webpack, postcss, tailwind, vue)
* **chore**: Changes that affect the general software package maintenance processes (example scopes: package, build, config)
* **ci**: Changes to our CI configuration files and scripts (example scopes: travis, jenkins)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **release**: Changes that are bundled in a new *version release* for the repository. A version release maps to a git tag being created.
* **review**: Changes that are *requested* from a pull request reviewer.
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests

#### <a name="commit-scopes"></a> Scope

The scope should be the name of the module affected.

The following is the list of supported scopes:

##### <a name="commit-scopes-common"></a> Common scopes

These commit scopes can be used for *any* of the software repositories:

* **api**: Changes that affect the application programming interface of a software package
* **base**: Changes that affect the base implementation layer of a software package
* **build**: Changes that affect the build process of a software package
* **changelog**: Change that affect *only* the CHANGELOG.md files in subprojects of a software package
* **config**: Changes that affect the configuration of a software package
* **deps**: Changes that affect the dependencies list (requirements) of a software package
* **env**: Changes that affect the environment (or deploy thereof) of a software package
* **examples**: Changes that affect the examples produced inside of a software package
* **i18n**: Changes that affect the *internationalization* of a software package
* **package**: Changes that affect the general files and folders structure of a software package

##### <a name="commit-scopes-contracts"></a> Valid scopes for **@dhealth/contracts**

* **types**: Changes that affect exported types of the contracts library
* **buffers**: Changes that affect the contract buffers and binary payload of the contracts library
* **contracts**: Changes that affect the available contracts as exported by the contracts library
* **factories**: Changes that affect contract factories of the contracts library

#### Subject

The subject contains a succinct description of the change(s):

* preferably, use the imperative, present tense: "change" not "changed"
* don't capitalize the first letter
* no dot (.) at the end
* mention a Github issue number if necessary (e.g. `[...] ...: ... (fixes #123)`)

## <a name="project-status"></a> Project status

We introduce a *standard* for determining the overall *state of a project* as it pertains to the lifecycle of open source software as presented in the attached source code repository.

This standard is currently not enforced and willingly added to repositories *that MUST* include a **Status** badge in the [README](README.md) on the top of the file, alongside other badges already included.

The project status badge can take one of the following states:

* ![Idea](https://img.shields.io/badge/Status-Idea-ff0018.svg): This badge is attached to projects that are being started. Projects in this state *MAY* not respond to reports of issues or accept contributions. Projects marked as *ideas* don't necessarily have to ever move out of this state.
* ![Prototype](https://img.shields.io/badge/Status-Prototype-ff7c00.svg): This badge is attached to projects that are a bit further along than ideas. Often, this badge is attached to *proof-of-concepts* (PoC). Projects in this state *MAY* \[still\] not be accepting contributions, but *MAY* be open to feedback. Projects marked as *prototypes* don't necessarily have to ever move out of this state.
* ![In progress](https://img.shields.io/badge/Status-In%20progress-2b00ff.svg): This badge is attached to projects that are under development. Projects in this state *MAY* not be fully functional, but maintainers are more likely to accept contributions, help and feedback. Projects marked as being *in progress* *MUST* move out of this state to become one of *paused*, *active* or any of the below listed states.
* ![Paused](https://img.shields.io/badge/Status-Paused-ff9e9e.svg): This badge is attached to projects that currently not active but that *MAY* be continued at a later point in time. Projects in this state *MAY* be slow to respond or unresponsive to issues and feedback. Projects marked as *paused* don't necessarily have to ever move out of this state but are likely to become one of *active* or *archived* at a later point in time.
* ![Active](https://img.shields.io/badge/Status-Active-9effe1.svg): This badge is attached to projects that are *functional* but still actively developing new features. Projects in this state *MUST* accept contributions (after successful review), help and feedback and *MUST* have had previous *stable* releases.
* ![Stable](https://img.shields.io/badge/Status-Stable-05d302.svg): This badge is attached to projects that are *effectively complete*. Projects in this state *MAY* release security patches and *MUST* accept contributions (after successful review), help and feedback.
* ![Relinquished](https://img.shields.io/badge/Status-Relinquished-fec17d.svg): This badge is attached to projects that are no longer being developed or maintained by the original maintainer(s). Projects in this state *MAY* be fully functional but are likely to be looking for new maintainer(s). Projects marked as *relinquished* don't necessarily have to ever move out of this state.
* ![Archived](https://img.shields.io/badge/Status-Archived-fefc7d.svg): This badge is attached to projects that are *no longer active*. Projects in this state *MAY* or *MAY NOT* be read-only and maintainer(s) *MAY* not intend to fix any issues (security or otherwise), or support users.
* ![Static](https://img.shields.io/badge/Status-Static-e3fe7d.svg): This badge is attached to projects that are *archived* immediately after initial publication. Projects in this state *MAY* be fully functional but the maintainer(s) *MAY* not intend to fix any issues (security or otherwise), or support users

[Source](https://leaddev.com/agile-other-ways-working/how-communicate-state-your-open-source-project)

## <a name="welcome"></a> Welcoming contributions!

We are happy about any contributions, help or feedback about our open source software and our team will be happy to support you in the process of starting to contribute or collaborate.

We welcome contributions to our software and use these contributing notes as a way to set some simple [rules](#rules) around contributions that our team will review and assess.

--

*CONTRIBUTING.md is based on [CONTRIBUTING-template.md](https://github.com/nayafia/contributing-template/blob/master/CONTRIBUTING-template.md)* 
and [elasticsearch/CONTRIGUTING](https://github.com/elastic/elasticsearch/blob/master/CONTRIBUTING.md)

[pull-request]:https://help.github.com/articles/about-pull-requests/
[github-issues]:https://github.com/dhealthproject/dapps-framework/issues