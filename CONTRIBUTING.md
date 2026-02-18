# Contributing

Thanks for contributing!

This project tracks observable CSS behavior across light and shadow DOM contexts. Contributions that improve accuracy, clarity, and upstream alignment are welcome.

**Evidence helps.** When possible, include WPT links, browser version(s) tested, spec references, and upstream issues/bugs.

## Where to start

### Issues

Use an issue if:

- Something is incorrect, outdated, or missing context
- You have links or evidence to add (spec/CSSWG/bugs/WPT)
- You want to propose a rating change

We provide issue forms for:

- **Correction / clarification**
- **Rating change proposal**

### Discussions

Use a Discussion to propose a **new feature to track**.

We use a discussion category form to collect consistent details (feature name, why it matters, shadow DOM behavior, and relevant links).

Features are prioritized based on architectural impact, adoption relevance, and cross-context complexity.

### Pull Requests

PRs are great for:

- Straightforward fixes and copy edits
- Adding links / resources
- Updating feature notes or summaries

A minimal PR template will prompt for references where relevant.

## What makes a contribution easy to review

Include as many of these as apply:

- WPT link(s) (preferred)
- Browser + version(s) tested (stable unless you’re calling out a regression)
- Spec link(s)
- CSSWG issue(s)
- Browser bug(s)
- Minimal repro (if WPT coverage doesn’t exist)

If you’re unsure whether something is a bug vs. expected behavior, open an issue — we can sort it out together.

## Rating changes

If you think a support rating should change:

1. Open a **Rating Change Proposal** issue.
2. Include supporting evidence and links.
3. If there’s agreement, a PR can apply the update.

This keeps changes traceable and avoids “drive-by” rating edits without context.

## New features to track

Start a **Feature Proposal** Discussion and include:

- Feature name
- Why it’s worth tracking (architectural impact / adoption relevance)
- Shadow DOM behavior or expectation mismatches vs. light DOM
- WPT/spec/issue/bug links (if available)

We prioritize features with high architectural impact or known cross-context complexity.

## External / upstream work

This project surfaces observed behavior, but improvements often land upstream:

- File or contribute to CSSWG issues
- File browser bugs with reproducible cases
- Contribute to WPT

If you do upstream work, link it back in an issue or PR so we can keep the dashboard current.

## Code of Conduct

Please follow our [Code of Conduct](./CODE_OF_CONDUCT.md) when participating in issues and discussions.
