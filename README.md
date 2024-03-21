[![Node.js version support][shield-node]][info-node]
[![codecov](https://codecov.io/gh/locr-company/js-progress/graph/badge.svg?token=1Y2x4xM8Or)](https://codecov.io/gh/locr-company/js-progress)
![github_workflow_status](https://img.shields.io/github/actions/workflow/status/locr-company/js-progress/node.js.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=locr-company_js-progress&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=locr-company_js-progress)
![github_tag](https://img.shields.io/github/v/tag/locr-company/js-progress)
![NPM Version](https://img.shields.io/npm/v/%40locr-company%2Fprogress)

# 1. Installation

```bash
npm install @locr-company/progress
```

# 2. How to use

```js
import Progress from '@locr-company/progress';

const progress = new Progress(1_000);
progress.incrementCounter();
console.log(progress.Counter); // 1
console.log(progress.PercentageCompleted); // 0.1
console.log(progress.toFormattedString()); // progress => 1/1000 (0.10%); elapsed: 00:00:01; ete: 00:16:39; eta: 2021-10-10 20:00:01
progress.setCounter(1000);
console.log(progress->PercentageCompleted); // 100
```

# 3. Development

Clone the repository

```bash
git clone git@github.com:locr-company/js-progress.git
cd js-progress/.git/hooks && ln -s ../../git-hooks/* . && cd ../..
npm install
```

[info-node]: package.json
[shield-node]: https://img.shields.io/node/v/@locr-company/progress.svg
