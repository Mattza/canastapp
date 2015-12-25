'use strict';
var canastApp = angular.module('canastApp', ['ngRoute', 'LocalStorageModule','ngAnimate']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', { templateUrl: './scoreboard.html', controller: 'ScoreboardCtrl' });
        $routeProvider.when('/round', { template: '/round.html', controller: 'RoundCtrl' });
        $routeProvider.otherwise({ redirectTo: '/' });
    }]);

canastApp.controller('ScoreboardCtrl',['$scope','canastAppService', function ScoreboardCtrl($scope, canastAppService) {
    $scope.canasta = canastAppService.canasta;
    $scope.newPlayer = "";
    $scope.isAdding = function(){
        return $scope.canasta.rounds == 0 && $scope.canasta.players.length<3
    }
    $scope.getWidth = function(){
        return Math.floor(100/($scope.canasta.players.length+($scope.isAdding()?1:0)))+'%';
    }
    $scope.addPlayer = function () {

        $scope.canasta.players.push({ name: $scope.newPlayer });
        $scope.newPlayer = "";
    }
    $scope.saveRound = function (scores) {
        $scope.error = "";
        if (scores.length === $scope.canasta.players.length) {
            var errorCol = [];
            for (var i = 0; i < scores.length; i++) {
                if (isNaN(scores[i]) || scores[i] === "" || parseInt(scores[i]%5,10)!==0) {
                    errorCol.push(i);
                }
            }

            if (errorCol.length === 0) {
                canastAppService.addRound(scores);
                for (var i = 0; i < scores.length; i++) {
                    scores[i] = "";
                }
            } else {
                for (var i = 0; i < errorCol.length; i++) {
                    $scope.error += $scope.canasta.players[errorCol[i]].name + " har inte korrekt värde, ";
                }

            }
        } else {
            $scope.error = "Alla spelare måste ha poäng"
        }
    }
    $scope.deleteRound = function (index) {
        canastAppService.deleteRound(index);
    }
    $scope.scores = [];
    $scope.names = [
        'Mattias',
        'Tim',
        'Bilal',
        'Fredrik',
        'Tokko',
        'båtis',
        'Charlie',
        'Bratz',
    ]

}]);


canastApp.directive('sumBackground', function () {
    return function (scope, element, attrs) {
        var color = "none";
        if (attrs.sumBackground < 0) {
            color = "red";
        }
        if (attrs.sumBackground >= 1500) {
            color = "green";
        }
        if (attrs.sumBackground >= 3000) {
            color = "orange";
        }


        element.css("background", color);

    }
});

canastApp.service('canastAppService',['$http', '$q', '$routeParams', 'localStorageService', function ($http, $q, $routeParams, localStorageService) {
    //this.canasta = localStorageService.get('canastaSave');

    this.canasta = localStorageService.get('canasta');
    if (!this.canasta) {
        this.canasta = {};
        this.canasta.rounds = [];
        this.canasta.players = [];
    }
    this.addRound = function (scores) {

        var sums = [];
        var intScore = [];
        var lastSum = [0,0,0,0];//Snabbhack
        if (this.canasta.rounds.length > 0) {
            lastSum = this.canasta.rounds[this.canasta.rounds.length - 1].sums;
        }
        for (var i = 0; i < scores.length; i++) {

            sums.push(lastSum[i] + parseInt(scores[i], 10));
            intScore.push(parseInt(scores[i], 10));
        }
        var newRound = {};
        newRound.scores = intScore;
        newRound.sums = sums;
        this.canasta.rounds.push(newRound);
        localStorageService.add('canasta', this.canasta);
        //var rounds = this.canasta.Rounds;
        //$http.put('/api/canasta/' + $routeParams.canastaId + scoreString + playerId, scores)
        //.success(function(roundScore){
        //    rounds.push(roundScore);
        //});
    }
    this.deleteRound = function (index) {
        this.canasta.rounds.splice(index, 1);

    }
}]);/**
 * Created by matknu on 2015-12-24.
 */
