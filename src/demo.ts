import { DocumentRecord, OneDB } from './index.js';

interface User extends DocumentRecord {
  fname: 'ali';
  lname: 'md';
  age: 10;
}

async function demo () {
  const db = new OneDB('db/user-list');

  const user1 = await db.get<User>('user1') ?? {
    fname: 'ali',
    lname: 'md',
    age: 10,
  };

  user1.age ++;

  db.set('user1', user1);

  console.log('user1: %j', user1);
}

demo();
