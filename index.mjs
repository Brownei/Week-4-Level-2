import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib({ REACH_NO_WARN: 'Y' });
const sbal = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(sbal);
const ctcAlice = accAlice.contract(backend);

const users = await stdlib.newTestAccounts(10, sbal);

const willError = async (f, whoi) => {
  const who = users[whoi];  
  let e;
  try {
    await f();
    e = false;
  } catch (te) {
    e = te;
  }
  if ( e === false ) {
    throw Error(`Expected to error, but didn't`);
  }
  console.log( stdlib.formatAddress(who), 'Alice can no longer accept attachers'  );
};
const ctcWho = (whoi) =>
  users[whoi].contract(backend, ctcAlice.getInfo());

const userBob = async (whoi) => {
  const who = users[whoi];
  const ctc = ctcWho(whoi);
  await ctc.apis.Bob.bobUsers();
  console.log('Counters: ',whoi);
  console.log('New Bob User', stdlib.formatAddress(who), ' has attached to the contract ');
}
await Promise.all([
  backend.Alice(ctcAlice, {
    deployerReady : () => {
        console.log('Alice has deployed the contract');
        console.log('Waiting for attachers.......');
    }

  }),

await userBob(0),
await userBob(1),
await userBob(2),
await userBob(3),
await userBob(4),
await willError(() => userBob(5),5),
await willError(() => userBob(6),6),
await willError(() => userBob(7),7),
await willError(() => userBob(8),8),
await willError(() => userBob(9),9),
process.exit()
]);