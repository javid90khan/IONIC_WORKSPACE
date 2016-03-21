angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ExpensesCtrl', function ($scope,$rootScope,$ionicModal,ExpensesService, $q){

console.log("controller called");
$scope.expensesData=[];
//todo fetch paidByUsers from service
$scope.paidByUsers=[{displayName:'Javid Khan',emailID:'javid90khan@gmail.com'},{displayName:'Jugnu',emailID:'Jugnu123@qwert.com'},{displayName:'Srishti',emailID:'srishti@qwert.com'}];
$scope.defaultExpense={date:new Date(),split:"Equally",paidBy:{},getsBack:0};
    $scope.expense=angular.copy($scope.defaultExpense);
    
    $scope.$on('$ionicView.enter', function(){
		console.log("view enter called");
		ExpensesService.getAllExpenses($q).then(function(Expenses){
					$scope.expensesData=Expenses;
				});
                console.log('expenseData  fetched just now')//+JSON.stringify($scope.expensesData.length()));     
            });
			
	$scope.$on('$ionicView.afterEnter', function () {
    $scope.$broadcast('viewLoaded');
  });

	$ionicModal.fromTemplateUrl('templates/pages/add-expense.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
  
            $scope.addExpense = function () {
                $scope.modal.show();
				$scope.$broadcast('popupLoaded');
				$scope.expense.paidBy=$scope.paidByUsers[0];
            };
            
            $scope.cancelModal = function() {
                $scope.modal.hide();
                $scope.reset();
            };
            
            $scope.saveExpense = function(expense) {
			ExpensesService.addExpense(expense);
			console.log("after adding");
			$scope.$broadcast('expenseSaved');
		  
            $scope.reset();
            $scope.modal.hide();    
            };
            
            $scope.reset = function() {
        	$scope.expense = angular.copy($scope.defaultExpense);
   			};
			
			$scope.$on('expenseSaved', function(event, allExpensesDOC) {
				ExpensesService.getAllExpenses($q).then(function(Expenses){
					$scope.expensesData=Expenses;
				});
			});
			
	pouchDBSR.changes({live: true, since: 'now', include_docs: true}).on('change', function (change) {
    if (change.deleted) {
      // change.id holds the deleted id
      //onDeleted(change.id);
    } else { // updated/inserted
	console.log("updated");
	ExpensesService.getAllExpenses($q).then(function(Expenses){
					$scope.expensesData=Expenses;
				});
      // change.doc holds the new doc
      //onUpdatedOrInserted(change.doc);
    }
    //renderDocsSomehow();
  }).on('error', console.log.bind(console));

    
})

.controller('ExpensesCtrlTest', function ($scope, $rootScope, $ionicModal) {
	$scope.defaultExpense={date:new Date(),split:"Equally",paidBy:"Me"};
    $scope.expense=angular.copy($scope.defaultExpense);

	$ionicModal.fromTemplateUrl('templates/pages/add-expense.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
  
            $scope.addExpense = function () {
                $scope.modal.show();
            };
            
            $scope.cancelModal = function() {
                $scope.modal.hide();
                $scope.reset();
            };
            
            $scope.saveExpense = function(expense) {
            superRoomieDB.put(expense);
            $scope.reset();
            $scope.modal.hide();    
            };
            
            $scope.reset = function() {
        	$scope.expense = angular.copy($scope.defaultExpense);
   			};

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
