# 1. How to use

```js
import Progress from './src/js/Progress.js';

const progress = new Progress(1_000);
progress.incrementCounter();
console.log(progress.Counter); // 1
console.log(progress.PercentageCompleted); // 0.1
console.log(progress.toFormattedString()); // progress => 1/1000 (0.10%); elapsed: 00:00:01; ete: 00:16:39; eta: 2021-10-10 20:00:01
progress.setCounter(1000);
console.log(progress->PercentageCompleted); // 100
```

# 2. Development

Clone the repository

```bash
git clone git@github.com:locr-company/js-progress.git
cd js-progress/.git/hooks && ln -s ../../git-hooks/* . && cd ../..
npm install
```
