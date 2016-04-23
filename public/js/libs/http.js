function $fetch(url, type, data){

	return new Promise(function(resolve, reject){
	
		var xhr = new XMLHttpRequest();
		
		xhr.open(type, $apiUri + url, true);
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.send(data ? JSON.stringify(data) : {});
		
		xhr.onload = function(e) {
			if (this.status == 200) {
				var data = JSON.parse(this.response);
				if (data.result) resolve(data.result);
				else resolve(data);
			}
			else {
				var error = new Error(this.statusText);
				error.code = this.status;
				reject(error);
			}
		};
		
		xhr.onerror = function() {
			reject(new Error("Network Error"));
		};
	});
};