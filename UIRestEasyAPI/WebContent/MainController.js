var api_para = angular.module('ApiParameter', ['ngCookies']);

api_para.factory('ServiceAPIController',['$http','$rootScope','$cookieStore',function($http,$rootScope,$cookieStore) {


    var savedData = null;
    var authCredentials ={};
    var response={};

    $http.get('authdata.txt').then(function (response) {
        authCredentials=response.data;
    });

    function set(data) {
        savedData = data;
    };

    function get() {
        return savedData;
    };


    function setCredentials(username){

        $rootScope.user = username;
        $cookieStore.put('user', $rootScope.user);

    }

    function removeCredentials(){

        $rootScope.user = {};
        $cookieStore.remove('user');


    }

    function Login (username, password){

        response = { success: username === authCredentials.username && password === authCredentials.password };
        console.log(response);
        if (!response.success) {

            response.message = 'Username or password is incorrect';
            console.log(response.message);

        }
        return response;
    }
    return {

        removeCredentials:removeCredentials,
        setCredentials:setCredentials,
        set: set,
        get: get,
        Login: Login
    }

}]);

api_para.controller('ApiParameterController', function($scope, $http, $window, $location ,$rootScope,$cookieStore, ServiceAPIController,$timeout) {


    $scope.insertdata =[];
    $scope.updateAPI_by_id ="000 - test";
    $scope.showtableParameters = false;
    $scope.showtableWorkFlow = false;
    $scope.showupdateform = false;
    $scope.InsertParaForm = false;
    $scope.ShowUpdateDeleteForm=false;
    $scope.listOfAPI=true;
    $scope.selectedAPI = null;

    $scope.apiColumn= {
        apiID:null,parameterName:null,fieldName:null,type:0,traversePath:null,
        defaultValue:null,regex:null,postBody:0,position:null,optionalParent:false,
        mandatory:false,parents:null

    };

    $scope.User= {
        userName:null,password:null
    }

    console.log("in ApiParameterController");

    $rootScope.user = $cookieStore.get('user');
    var location = $location.absUrl();
    $scope.$on('$locationChangeStart',function (event, next, current) {
        if(!(location.includes("Login")) &&!$rootScope.user){
            window.location.href="/UIRestEasyAPI/UIRestEasyAPI/WebContent/Login.html";

        } else if(location.includes("Login") && $rootScope.user){
            window.location.href="/UIRestEasyAPI/UIRestEasyAPI/WebContent/ApiParameter.html";
        }
    })

    $scope.loggedON=true;

    var get_list_of_api = {
        method: 'GET',
        url:'http://soawsserver:8080/ASRestAPI/DashBoard/getidsList/AS_RESTAPI_PARAMETERS',
        //url:'http://www.mocky.io/v2/599c850e29000090012110eb',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    $http(get_list_of_api).then(function success(response) {

        console.log(response.data.LIST);
        $scope.name = response.data.LIST;

    },function errorCallBack(response){
        console.log("fail")
        console.log(response);
    });

    $scope.logOut = function () {
        ServiceAPIController.removeCredentials();
        window.location.href="/UIRestEasyAPI/UIRestEasyAPI/WebContent/Login.html";
    };//Logout Function

    $scope.login = function() {

        var  response = ServiceAPIController.Login( $scope.User.userName,$scope.User.password)

        if (response.success){
            ServiceAPIController.setCredentials($scope.User.userName);
            $window.location.href = "/UIRestEasyAPI/UIRestEasyAPI/WebContent/ApiParameter.html";

        }else {
            $window.alert(response.message);
        }
    }; //Login Function

    $scope.loadAPIDetail = function(items) {

        $scope.showupdateform = true;
        $scope.listOfAPI=false;
        $scope.selectedAPI = items;
        $scope.updateAPI_by_id = items.split(' -')[0];
        $scope.apiName = items.split('-')[1]
        $scope.getAPIById();
    }; // List of API's to View Mode for selected API

    $scope.goToAPIList = function() {


        $scope.showupdateform = false;
        $scope.listOfAPI=true;
        $scope.InsertParaForm = false;
        $scope.InsertWFForm = false;
        $scope.ShowUpdateDeleteForm ='';
        $scope.updateAPI_by_id = '';
        $scope.apiName='';
        $scope.selectedAPI='';
    }; // View or Update Mode  to List of API's

    $scope.showAPIForm = function() {


        $scope.listOfAPI=false;
        $scope.showupdateform = false;
        $scope.InsertParaForm = false;
        $scope.InsertWFForm = false;
        $scope.ShowUpdateDeleteForm =true;

    };// View Mode to Update Mode for Selected API

  /*  $scope.showAPIDataList = function(){

        $scope.listOfAPI=false;
        $scope.showupdateform = true;
        $scope.InsertParaForm = false;
        $scope.InsertWFForm = false;
        $scope.ShowUpdateDeleteForm =false;
        $scope.apiName = $scope.selectedAPI.split('-')[1]

    }; *///Update Mode to View Mode

    $scope.showInsertParaForm = function(){


        $scope.listOfAPI=false;
        $scope.showupdateform = false;
        $scope.InsertParaForm = true;
        $scope.InsertWFForm = false;
        $scope.ShowUpdateDeleteForm =false;
        $scope.apiName = $scope.selectedAPI.split('-')[1]

    }; // Insert new row Form for ASRestAPIParameter

    $scope.showInsertWFForm = function(){

        $scope.listOfAPI=false;
        $scope.showupdateform = false;
        $scope.InsertParaForm = false;
        $scope.InsertWFForm = true;
        $scope.ShowUpdateDeleteForm =false;
        $scope.apiName = $scope.selectedAPI.split('-')[1]

    }; // Insert new row Form for ASRestAPIWorkFlow


    $scope.addPara = function() {

        $scope.insertdata.push({

            apiID:parseInt($scope.updateAPI_by_id,10),
            apiName:$scope.apiName,
            parameterName:$scope.apiColumn.parameterName,
            fieldName:$scope.apiColumn.fieldName,
            type:$scope.apiColumn.type,
            regex:$scope.apiColumn.regex,
            traversePath:$scope.apiColumn.traversePath,
            defalut:$scope.apiColumn.defaultValue,
            postBody:$scope.apiColumn.postBody,
            index:$scope.apiColumn.position,
            optionalParent:$scope.apiColumn.optionalParent,
            manadatory:$scope.apiColumn.mandatory,
            parents:$scope.apiColumn.parents
        });
        $scope.apiColumn='';
        $scope.InsertParaToDB($scope.insertdata,'insertParamsInfo');


    }; // Insert new Parameter row
    
    $scope.addWFPara= function () {

        $scope.insertdata.push({
            apiID:parseInt($scope.updateAPI_by_id,10),
            apiName:$scope.apiName,
            refAPI:$scope.wfColumn.refAPI.split('-')[1],
            sequence:$scope.wfColumn.sequence,
            apiURL:$scope.wfColumn.apiURL,
            inputParams:$scope.wfColumn.inputParams,
            checkParam:$scope.wfColumn.checkParam,
            httpMethod:$scope.wfColumn.httpMethod,
            pathParams:$scope.wfColumn.pathParams
        });
        $scope.wfColumn='';

        $scope.InsertParaToDB($scope.insertdata,'insertWorkFlowInfo');

        
    }
    
    $scope.InsertParaToDB = function(insertdata, tableName) {

        var body = '{"LIST" :' + angular.toJson(insertdata,true) +'}';
        console.log(body);

        var req = {
            method: 'POST',
            url: 'http://soawsserver:8080/ASRestAPI/DashBoard/'+tableName,
            headers: {
                'Content-Type': 'application/json'
            },
            data : body
        };

        $http(req).then(function success(response) {


           $scope.insertdata=[];
            $scope.getAPIById();
            $scope.showAPIForm();

        },function errorCallBack(response){
            window.alert("Insert Failed. Try Again");
            $scope.insertdata=[];
            $scope.showAPIForm();

        });
    };

    $scope.getAPIById = function() {

        var getapi_req = {
            method: 'GET',
            url: 'http://soawsserver:8080/ASRestAPI/DashBoard/getAPIParamsInfo/'+parseInt($scope.updateAPI_by_id,10), //$scope.updateAPI_by_id.split('-')[0], http://www.mocky.io/v2/5995fd17110000b406cc43bd',//
            //url: 'http://www.mocky.io/v2/599d82972500009000d301e0',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $http(getapi_req).then(function success(response)
            {

                $scope.list = response.data.LIST;
                $scope.showtableParameters = true;

            },function errorCallBack(response){

                $window.alert("Could not fetch the results." + response.body )	;

            }
        )


        var getWorkFlow = {
            method: 'GET',
            url: 'http://soawsserver:8080/ASRestAPI/DashBoard/getWorkFlowInfo/'+parseInt($scope.updateAPI_by_id,10), //.split('-')[0], 'http://www.mocky.io/v2/5995fd17110000b406cc43bd',//
            //url:'http://www.mocky.io/v2/59a56e51100000b710b2ae57',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $http(getWorkFlow).then(function success(response)
            {

                $scope.WFlist = response.data.LIST;
                $scope.showtableWorkFlow = true;
                $scope.empty=false;
                $scope.errorMessage = false;

            },function errorCallBack(response){

                $scope.showtableWorkFlow = false;
                $scope.errorMessage = true;
                $timeout (function () {
                    $scope.empty= true;
                },3000);

            }
        )

    }; // Get API Parameters  and WorkFlow details

    $scope.updateValue= function(UpdateApiColumn,tableName) {

        var body = '{"TNAME":"'+ tableName+'","UpdateList":'+ angular.toJson(UpdateApiColumn,true)+'}';

        console.log(body);
        var req = {
            method: 'POST',
            url: 'http://soawsserver:8080/ASRestAPI/DashBoard/updateconfig',

            headers: {
                'Content-Type': 'application/json'
            },
            data : body
        }


        $http(req).then(function success(response)
            {
                $scope.getAPIById();
                $window.alert("Parameter Updated successfully");

            },function errorCallBack(response){
                console.log("value update failed")
                $scope.getAPIById();
                $window.alert("Update Failed. Try again");

            }
        )
    };//Update row


    $scope.deleteColumn = function(id,tableName) {

        body = '{"TNAME":"'+ tableName+'","COLUMNID":'+ id+'}';

        console.log(body);

        console.log("in delete");
        console.log(body);
        console.log(id);

        var delete_req = {
            method: 'POST',
            url: 'http://soawsserver:8080/ASRestAPI/DashBoard/deleteconfig',
            headers: {
                'Content-Type': 'application/json'
            },
            data : body
        }

        var res = $window.confirm("Are you sure you want to delete this entry?");
        if (res === true)
        {

            $http(delete_req).then(function success(response)
                {
                    $scope.getAPIById();

                },function errorCallBack(response){
                    $scope.getAPIById();
                $window.alert("Delete Failed. Try again");

                }
            );
        }
        else{
            console.log("in delete else")
        }

    };//Delete row

});


