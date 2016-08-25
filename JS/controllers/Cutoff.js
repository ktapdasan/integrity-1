app.controller('Cutoff', function(
                                        $scope,
                                        SessionFactory,
                                        EmployeesFactory,
                                        CutoffFactory,
                                        ngDialog,
                                        UINotification,
                                        md5
                                    ){

	$scope.pk='';


    $scope.filter= {};

    $scope.type = '';

    $scope.modal = {};
    $scope.levels = {};

    $scope.cutofftypes = {};
    $scope.cutoffdates = {};

    $scope.days ={};

    init();

    function init(){
        var promise = SessionFactory.getsession();
        promise.then(function(data){
            var _id = md5.createHash('pk');
            $scope.pk = data.data[_id];

            
            cutofftypes();
            show();
            
        });
    }
   

    function cutofftypes(){
        $scope.cutofftypes.status = false;
        $scope.cutofftypes.data= '';
        
        var promise = CutoffFactory.fetch_types();
        promise.then(function(data){
            $scope.cutofftypes.status = true;
            $scope.cutofftypes.data = data.data.result;
        })
        .then(null, function(data){
            $scope.cutofftypes.status = false;
        });
    }

    $scope.show_type = function(){
    	type();
        
    }

   	function type(){
   		if ($scope.filter.status == 1) {
   			$scope.displayM = true;
   			$scope.displayB = false;
   		}
   		else {
   			$scope.displayB = true;
   			$scope.displayM = false;
   		}   		
    }


	$scope.save = function(){  
		type();

        $scope.modal = {
            title : '',
            message: 'Are you sure you want to save cutoff days?',
            save : 'Yes',
            close : 'Cancel'

        };
        
        ngDialog.openConfirm({
            template: 'ConfirmModal',
            className: 'ngdialog-theme-plain',
            
            scope: $scope,
            showClose: false
        })
        
        .then(function(value){
            return false;
        }, function(value){

            var promise = CutoffFactory.submit_type($scope.filter);
            promise.then(function(data){

                UINotification.success({
                                            message: 'You have successfully saved cutoff days.', 
                                            title: 'SUCCESS', 
                                            delay : 5000,
                                            positionY: 'top', positionX: 'right'
                                        });  

            })
            .then(null, function(data){

                UINotification.error({
                                        message: 'An error occured, unable to save, please try again.', 
                                        title: 'ERROR', 
                                        delay : 5000,
                                        positionY: 'top', positionX: 'right'
                                    });
            });
	   });
       
    }

    function fetch_dates(){        
        var promise = CutoffFactory.fetch_dates();
        promise.then(function(data){
            $scope.cutoffdates.data = data.data.result;
            $scope.cutoffdates.data[0].dates = JSON.parse($scope.cutoffdates.data[0].dates);
            
            $scope.filter.status = $scope.cutoffdates.data[0].cutoff_types_pk;

            if ($scope.cutoffdates.data[0].cutoff_types_pk == "1"){
                $scope.filter.start_m = $scope.cutoffdates.data[0].dates.from;
                $scope.filter.end_m = $scope.cutoffdates.data[0].dates.to;
            }
            else{
                $scope.filter.start_bf = $scope.cutoffdates.data[0].dates.first.from;
                $scope.filter.end_bf = $scope.cutoffdates.data[0].dates.first.to;

                $scope.filter.start_bs = $scope.cutoffdates.data[0].dates.second.from;
                $scope.filter.end_bs = $scope.cutoffdates.data[0].dates.second.to;
            }

            type();
        })
        .then(null, function(data){
            if ($scope.cutoffdates.data[0].cutoff_types_pk == "1"){
                $scope.filter.start_m = 1;
                $scope.filter.end_m = 30;
            }
            else {
                $scope.filter.start_bf = 1;
                $scope.filter.end_bf = 15;

                $scope.filter.start_bs = 16;
                $scope.filter.end_bs = 30;
            }

            type();
        });
    }

    $scope.show_days = function(){
        show();
    }

    function show() {
        for(var i=1;i<32;i++){
            $scope.days[i] = i;      
        };

        fetch_dates();      
    }

});
