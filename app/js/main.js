var app = angular.module('app',[]);

app.controller('weather', ['$scope','$http',function($scope,$http){

    // const variables
    var weatherApiKey = 'c04a9512cf2f19dfcf7709bb07fcc4c5';
    var defaultCity = 'San-francisco';
    var zipReg = /\d{5}/g;

    // Get User Location from the Browser
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        requestWeather('lat='+ crd.latitude + '5&lon=' + crd.longitude);
        initMap(crd.latitude, crd.longitude);
    }

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
        requestWeather('q='+defaultCity);
    }

    function initLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success, error, options);
        }else{
            requestWeather('q='+defaultCity);
            
        }
    }
    initLocation();

    // Update restuls base on search input
    $scope.getweather = function() {
        if ($scope.showSearch == true){
            requestWeather(validateLocation($scope.address));
            $scope.showSearch = false;
            $scope.address = "";
        }else{
            $scope.showSearch = true;
            document.getElementById("address-input").focus();
        }
    };

    function validateLocation(location){
        if (location != undefined && location.length > 1){
            console.log(location);
            if (location.match(zipReg) && location.length == 5){
                console.log("it's zip code");
                return 'zip='+location+',us';

            }else{
                return 'q='+location;
            }
        }else{
            console.log('def' + typeof location);
            return 'q='+defaultCity;
            //return false
        }
    }

    function requestWeather(location){
        $http.get('http://api.openweathermap.org/data/2.5/weather?' + location + '&units=metric&appid=' + weatherApiKey)
            .success(function(data, status, headers, config) {
                $scope.weather = data;
                initMap(data.coord.lat, data.coord.lon );
            })
            .error(function(data, status, headers, config) {
                // log error
            });
    }

    var map;
    function initMap(lat, lng) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: lat, lng: lng},
            zoom: 12
        });
    }

}]);


app.filter('rounded', function(){
    return function(text){
        return Math.round( parseInt(text) );
    }
});
