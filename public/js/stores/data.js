app.stores.data = function(){

	riot.observable(this);

	var $ = this;

	this.items = [];
	
	this.status = [];

	this.on("data:list:init", function(){
		return new Promise(function(resolve, reject){
		    fetch($apiUri + 'data/list/init/' + $sid)
		    .then(function(response){
		        if (response.status !== 200){
		            console.log('Looks like there was a problem. Status Code: ' + response.status);
		            return;
		        }
				return response.json();
		    })
			.then(function(data){
				$.items = data.result.list;
				$.status = data.result.status;
				$.trigger("data:list:init::response", {
					list: $.items,
					status: $.status
				});
			})
		    .catch(function(error){
		        console.log('Request failed', error);
		    });
		});
	});
	
};