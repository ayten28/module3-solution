(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItems);

    function FoundItems() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                foundItems: '<',
                onEmpty: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'menu',
            bindToController: true
        };
        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
     var menu = this;

  menu.searchMenuItems = function(shortName)
  {
    var promise = MenuSearchService.getMatchedMenuItems(shortName);
    promise.then(function(items) {
                  if (items && items.length > 0) {
                     menu.message = '';
                     menu.found = items;
                  } else {
                    console.log("nthn found");
                     menu.message = 'Nothing found!';
                     menu.found = [];
                  }
              });

  };
   menu.removeMenuItem = function(itemIndex)
   {
     menu.found.splice(itemIndex, 1);
   }

}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];

function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (shortName) {
    return  $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    })
    .then(function(response) {
      var foundItems = [];
      for (var i = 0; i <  response.data['menu_items'].length; i++) {
            var descr =  response.data['menu_items'][i]['description'];
            if (shortName.length > 0 && descr.toLowerCase().indexOf(shortName) !== -1) {
              foundItems.push(response.data['menu_items'][i]);
            }
          }
            return foundItems;
          });
        };

}


})();
