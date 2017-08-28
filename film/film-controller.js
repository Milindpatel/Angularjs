angular.module('myApp').controller('FilmController',FilmController);

function FilmController($routeParams,FilmFactory){
    var vm = this;
    var id = $routeParams.id;

   FilmFactory.getOneFilm(id).then(function(response){
       vm.film = response;
   })
    
}