// Objava bez GitHub Actions: gradi sajt i šalje dist/ na granu gh-pages.
// Pokretanje: npm run deploy
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });
const out = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();

const remote = out('git remote get-url origin');
const name = out('git config user.name');
const email = out('git config user.email');
const rev = out('git rev-parse --short HEAD');

run('npm run build');
const dist = path.resolve('dist');
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
fs.rmSync(path.join(dist, '.git'), { recursive: true, force: true });

const git = `git -c user.name="${name}" -c user.email="${email}" -c core.autocrlf=false`;
run(`${git} init -q -b gh-pages`, dist);
run(`${git} add -A`, dist);
run(`${git} commit -q -m "Objava sa main@${rev}"`, dist);
run(`${git} push -f -q ${remote} gh-pages`, dist);
fs.rmSync(path.join(dist, '.git'), { recursive: true, force: true });
console.log('Objavljeno na granu gh-pages. Sajt se osvežava za 1 do 2 minuta.');
