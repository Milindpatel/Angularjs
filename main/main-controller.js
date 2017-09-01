angular.module('myApp').controller('MainController', MainController);

function MainController(FilmFactory){
    var vm = this;

    FilmFactory.getAllFilms().then(function(response){
        vm.films = response;
    })
    
    vm.name = 'Milind';
    vm.date1 = "12 February 2016";
    vm.date2 = "11 March 2016";
    vm.date3 = "3 January 2016";
    vm.date4 = "25 April 2014";
}