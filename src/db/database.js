import PouchDB from 'pouchdb-react-native';
import SQLite from 'react-native-sqlite-2';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite)
PouchDB.plugin(SQLiteAdapter)
PouchDB.plugin(require('pouchdb-find'));

const BOOK_DB = 'Books.db';

let bookDb = null;

const _createBookDb =  function() {
  const db =  new PouchDB(BOOK_DB, { adapter: 'react-native-sqlite', revs_limit: 1 });
  return db;
}

export function getBookDb() {
  if (!bookDb) {
    bookDb = _createBookDb();
  }
  return bookDb;
}

