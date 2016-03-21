angular.module('starter.services', [])

.factory('ExpensesService', function ($q) {
	var Expenses=[];
return {
    getAllExpenses: function($q) {
		
		console.log("fetching values");
		var deferred = $q.defer();
		pouchDBSR.get('allExpensesDOC').then(function(allExpensesDOC){
			Expenses=allExpensesDOC.Expenses
			deferred.resolve(Expenses);
		});
		return deferred.promise;
		/*pouchDBSR.allDocs  ({include_docs: true, descending: true},function callback(err, doc) {
            if (!err) {
                var rows = [];
                for (var x in doc.rows) 
                    rows.push(doc.rows[x].doc);
                }

            Expenses= rows;
			deferred.resolve(Expenses);
			console.log("printing values");
			console.log("values"+JSON.stringify(Expenses));
            });
		console.log(JSON.stringify(Expenses));
		return deferred.promise; */
	},
	addExpense: function(expense) {
		//TODO : get user count from service
		expense.getsBack=expense.amount-(expense.amount/3);
		  
		pouchDBSR.get('allExpensesDOC').catch(function (err) {
		  if (err.status === 404) { // not found!
			return {
			  _id: 'allExpensesDOC',
			  Expenses:[]
			};
		  } else { // hm, some other error
			throw err;
		  }
		}).then(function (allExpensesDOC) {
			//found doc- add new expense
			allExpensesDOC.Expenses.push(expense);
			//update doc
			pouchDBSR.put({
			_id: 'allExpensesDOC',
			_rev: allExpensesDOC._rev,
			Expenses: allExpensesDOC.Expenses
		  }).then(function(response){
			  console.log("post response:"+JSON.stringify(response));
			
		  });	
		}).catch(function (err) {
			console.log("error"+err);
		});
	}
	};
})

.factory('RoomiesService', function ($q) {
	var Roomies=[];
return {
    getAllRoomies: function($q) {
		
		console.log("fetching values");
		var deferred = $q.defer();
		pouchDBSR.allDocs({include_docs: true, descending: true},function callback(err, doc) {
            if (!err) {
                var rows = [];
                for (var x in doc.rows) 
                    rows.push(doc.rows[x].doc);
                }

            Roomies= rows;
			deferred.resolve(Roomies);
			console.log("printing values");
			console.log("values"+JSON.stringify(Roomies));
            });
		console.log(JSON.stringify(Roomies));
		return deferred.promise; 
	},
	addRoomie: function(roomie) {/*
		//TODO : get user count from service
		roomie.getsBack=roomie.amount-(roomie.amount/3);
		
		 pouchDBSR.post(roomie, function callback(err, result) {
                    if (!err) {
                      console.log('Successfully saved an expense!');
                    }
                });*/
	}
	};
})

        
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
