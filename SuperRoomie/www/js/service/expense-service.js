(function() {

    angular.module('starter').factory('ExpenseService', ['$q', ExpenseService]);

    function expenseService($q) {  
        var _db;    
        var _expenses;

        return {
            initDB: initDB,

            getAllexpenses: getAllexpenses,
            addexpense: addexpense,
            updateexpense: updateexpense,
            deleteexpense: deleteexpense
        };

        function initDB() {
            // Creates the database or opens if it already exists
            _db = new PouchDB('expensesDB', {adapter: 'websql'});
        };

        function addExpense(expense) {
            return $q.when(_db.post(expense));
        };

        function updateExpense(expense) {
            return $q.when(_db.put(expense));
        };

        function deleteExpense(expense) {
            return $q.when(_db.remove(expense));
        };

        function getAllExpenses() {

            if (!_expenses) {
                return $q.when(_db.allDocs({ include_docs: true}))
                          .then(function(docs) {

                            // Each row has a .doc object and we just want to send an 
                            // array of expense objects back to the calling controller,
                            // so let's map the array to contain just the .doc objects.
                            _expenses = docs.rows.map(function(row) {
                                // Dates are not automatically converted from a string.
                                row.doc.Date = new Date(row.doc.Date);
                                return row.doc;
                            });

                            // Listen for changes on the database.
                            _db.changes({ live: true, since: 'now', include_docs: true})
                               .on('change', onDatabaseChange);

                           return _expenses;
                         });
            } else {
                // Return cached data as a promise
                return $q.when(_expenses);
            }
        };

        function onDatabaseChange(change) {
            var index = findIndex(_expenses, change.id);
            var expense = _expenses[index];

            if (change.deleted) {
                if (expense) {
                    _expenses.splice(index, 1); // delete
                }
            } else {
                if (expense && expense._id === change.id) {
                    _expenses[index] = change.doc; // update
                } else {
                    _expenses.splice(index, 0, change.doc) // insert
                }
            }
        }
        
        function findIndex(array, id) {
          var low = 0, high = array.length, mid;
          while (low < high) {
            mid = (low + high) >>> 1;
            array[mid]._id < id ? low = mid + 1 : high = mid
          }
          return low;
        }
    }
})();