function $fetch(url, type, data){

	return new Promise(function(resolve, reject){
	
		fetch($apiUri + url + "/" + $sid, 
		{
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			method: type,
			body: data ? JSON.stringify(data) : {}
		})
		.then(function(response){
			return response.json();
		})  
		.then(function(response){
			if (response && response.result)
			resolve(response.result);		
		})		
		.catch(function (error) {  
			reject(error);
		});
	});
};