var wf_para = angular.module('WFParameter', []);

wf_para.controller('WFParameterController', function($scope, $http, $window) {

$scope.updateform = false;
$scope.inserteddata =[];
$scope.showtable = false;
$scope.showupdateform = false;
$scope.InsertParaForm = false;
$scope.ShowUpdateDeleteForm=false;
$scope.listOfAPI=true;
$scope.updateWF_by_id ="000 - test"
$scope.wfColumn=
{apiID:null,refAPI:null,priority:1,inputParams:null,
checkParam:null,httpMethod:"POST",pathParams:null	
};


/*var get_list_of_api = {
		 method: 'GET',
		 url: 'http://soawsserver:8080/ASRestAPI/DashBoard/getidsList/AS_RESTAPI_WORKFLOW',
		 headers: {
		   'Content-Type': 'application/json'
		 } 
}

console.log("in WFParameterController")

	$http(get_list_of_api).then(function success(response)
	{
		console.log(response.status);
		console.log(response.data);
		console.log(response.data.LIST);
		$scope.name = response.data.LIST;
		
	},function errorCallBack(response){
      	console.log("fail")
      	console.log("response-->" +response);
   });*/
   

$scope.loadAPIDetail = function()
{
	console.log("in loadAPIDetail function")
	
	$scope.showupdateform = true;
	$scope.listOfAPI=false;
	$scope.updateAPI_by_id = 4001;//$scope.items.split('-')[0]
	$scope.getAPIById();
};

$scope.goToAPIList = function()
{
	console.log("in loadAPIDetail function")
	
	$scope.showupdateform = false;
	$scope.listOfAPI=true;
	$scope.InsertParaForm = false;
	$scope.updateWF_by_id = null;
};

$scope.showAPIForm = function()
{ 
	console.log("in showAPIForm function")
	
	$scope.listOfAPI=false;
	$scope.showupdateform = false;
	$scope.InsertParaForm = false;
	$scope.ShowUpdateDeleteForm =true;
	$scope.apiName = 4001;  //$scope.items.split('-')[1] 
};

$scope.showAPIDataList = function(){
	
	console.log("in showAPIDataList function")
	
	$scope.listOfAPI=false;
	$scope.showupdateform = true;
	$scope.InsertParaForm = false;
	$scope.ShowUpdateDeleteForm =false;
	$scope.apiName = 4001;  //$scope.items.split('-')[1] 
	
};

$scope.showInsertParaForm = function(){
	
	console.log("in showAPIDataList function")
	
	$scope.listOfAPI=false;
	$scope.showupdateform = false;
	$scope.InsertParaForm = true;
	$scope.ShowUpdateDeleteForm =false;
	$scope.apiName = 4001;  //$scope.items.split('-')[1] 
	
};



    $scope.addwfPara = function() {
  
        	console.log(" in WFParameterController : Add Para method");
        	wfColumn.apiID = wfColumn.apiID.split('-')[0]
        	wfColumn.refAPI = wfColumn.refAPI.split('-')[1]
        	console.log( wfColumn.apiID + " and ref api : "+ wfColumn.refAPI);
        	
        	var someObjStr = angular.toJson($scope.wfColumn,true);
        //	console.log("someobject-->"+ someObjStr);
        	$scope.inserteddata.push($scope.wfColumn);
       // 	console.log($scope.inserteddata);
        	$scope.wfColumn={};        
        	$scope.inserteddata;
        	$scope.InsertParaToDB();

    };
    
    $scope.InsertParaToDB = function(inserteddata) {
	  	
    	var body = '{"LIST" :' + angular.toJson($scope.inserteddata,true) +'}';

    	console.log("body-->"+ body )
 
    	
    	var req = {
     			 method: 'POST',
     			 url: 'http://soawsserver:8080/ASRestAPI/DashBoard/insertWorkFlowInfo',
     			 headers: {
     			   'Content-Type': 'application/json'
     			 },
     			 data : body     				 
      	}
   
    			console.log(body);
    	        $http(req).then(function success(response)
    	       {
    	        	console.log("in InsertParaToDB");
    	        	console.log($scope.body);
    	        	console.log(response.status);
    	        	$scope.inserteddata=[];
    	        	
    	        },function errorCallBack(response){
    	      	console.log("response-->" +Success);
    	      	$scope.inserteddata=[];

	        	
    	       }		
    	       )
    	    };
   
    $scope.getWFById = function() {
    	
    	 
    console.log($scope.updateWF_by_id);
    	
    var getapi_req = {
    			 method: 'GET',
    			 url: 'http://soawsserver:8080/ASRestAPI/DashBoard/getWorkFlowInfo/'+$scope.updateWF_by_id, //.split('-')[0],
    			 headers: {
    			   'Content-Type': 'application/json'
    			 }   				 
     	}
    
		$http(getapi_req).then(function success(response)
	       {
	        	console.log("in get api by id");
	        	console.log("API ID -->"+ $scope.updateWF_by_id.split('-')[0]);
	        	console.log(response)
	        	$scope.list = response.data.LIST;
	        	$scope.list
	        	$scope.showtable = true;
	        	
	        },function errorCallBack(response){
	      	    console.log("response-->" +response)
	      	    	$window.alert("Could not fetch the results.This API might not have any Workflow parameters" + response.body )	;

	       }		
	       )

    };
    
    $scope.updateValue= function(UpdatewfColumn) {
	  	
    	body = '{"TNAME":"AS_RESTAPI_WORKFLOW","UpdateList":'+ angular.toJson(UpdatewfColumn,true)+'}';
    //	console.log(UpdatewfColumn);  
    	
    	//var someObjStr = angular.toJson(UpdatewfColumn,true);
    //	console.log(someObjStr); 
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
        	console.log("in updateAPI");
        	console.log("response-->" +response.status);
        	$scope.getWFById();
        	$window.alert("parameter updated successfully");
        	
        },function errorCallBack(response){
      	console.log("value update failed")
      	$window.alert("The update for not successfull " + response.status + '-->' + response.body);
      	
 
       }		
   )
   
    };
    
     $scope.deleteColumn = function(id) {
   		  
   		  body = '{"TNAME":"AS_RESTAPI_WORKFLOW","COLUMNID":'+ id+'}';
   		  
   		  	console.log("in delete");
   			console.log(body);
   		  //	console.log(UpdatewfColumn.columnId);
   		    console.log(id);
   		 
    	        	var delete_req = {
    	       			 method: 'POST',
    	       			 url: 'http://soawsserver:8080/ASRestAPI/DashBoard/deleteconfig',
    	       			 headers: {
    	       			   'Content-Type': 'application/json'
    	       			 },
    	       			 data : body
    	        		}
    	        	var res_wf = $window.confirm("Are you sure you want to delete this entry?");
    	        	if(res_wf === true)
    	        		{
		    	        	 $http(delete_req).then(function success(response)
		    	    	       {
		    	    	        	console.log("in delete id");
		    	    	        	console.log("API ID -->"+ id +" is deleted ");
		    	    	        	console.log(response.status);
		    	    	        	
		    	    	        },function errorCallBack(response){
		    	    	      	console.log("delete was successful")
		    	    	      	$scope.getAPIById();
		    	    	       }		
		    	         );
    	        		}
    	        	else
    	        		{
    	        		console.log("In delete else")
    	     }	
    	  };

    	  
});
