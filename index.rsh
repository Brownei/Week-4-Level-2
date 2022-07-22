"reach 0.1";

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    deployerReady: Fun([], Null),
  });

  const Bob = API('Bob', {
    bobUsers: Fun([], Bool),
  });

  init();

 Alice.only(() => {
    interact.deployerReady();
   
  });
  Alice.publish();
  const Bobs = new Set();
    commit(); 
  Alice.publish();
  const [iterate, status] =
    parallelReduce([0, true])
    .invariant(status == true)
    .while( iterate < 5 )
    .api_(Bob.bobUsers, () => {
      check( this != Alice, "you are the user");
      return [ 0, (k) => {
          k(true);
          Bobs.insert(this);
        return [ iterate + 1, true ];
      }];
    });
  transfer(balance()).to(Alice);
  commit();
  //exit();
});