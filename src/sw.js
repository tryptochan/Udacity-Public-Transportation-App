const cacheName = 'wmata';
const apiKey = '6b700f7ea9db408e9745c207da7ca827';
const pathApi = `https://api.wmata.com/Rail.svc/json/jPath?FromStationCode=J03&ToStationCode=G05&api_key=${apiKey}`
const mapUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/37/WMATA_system_map.svg';
const fontUrl = 'https://fonts.googleapis.com/css?family=Roboto';
const arriveApi = 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/'
const tripApi = 'https://api.wmata.com/Rail.svc/json/jSrcStationToDstStationInfo'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
      	'/',
      	pathApi,
      	mapUrl,
      	fontUrl
    	].concat(self.serviceWorkerOption.assets));
    })
  );
});

function modifyArrivalResponse(response) {
	return response.json().then(j => {
		let dataUsed = {Trains: [], updateTime: new Date()};
		j.Trains.forEach(elem => dataUsed.Trains.push({
			DestinationCode: elem.DestinationCode,
			Min: elem.Min
		}));
		const newResponse = new Response(JSON.stringify(dataUsed), {
			headers: {'content-type': 'application/json'}
		});
		return new Promise(resolve => resolve(newResponse));
	});
}

function modifyTripResponse(response) {
	return response.json().then(j => {
		let dataUsed = {StationToStationInfos: []};
		j.StationToStationInfos.forEach(elem => dataUsed.StationToStationInfos.push({
			CompositeMiles: elem.CompositeMiles,
			RailTime: elem.RailTime
		}));
		const newResponse = new Response(JSON.stringify(dataUsed), {
			headers: {'content-type': 'application/json'}
		});
		return new Promise(resolve => resolve(newResponse));
	});
}

self.addEventListener('fetch', function(event) {
	if (event.request.url.startsWith(arriveApi)) {
    caches.open(cacheName).then(cache => {
    	cache.match(event.request).then(response => {
	      if (response) {
	      	fetch(event.request)
	      	.then(modifyArrivalResponse)
	      	.then(updated => {
	      		cache.put(event.request, updated);
	      	});
	      	return response;
	      }

	      return fetch(event.request)
	      .then(modifyArrivalResponse)
	    	.then(newResponse => {
	        cache.put(event.request, newResponse.clone());
	        return newResponse;
	  		});
	    });
    });
  }

  if (event.request.url.startsWith(tripApi)) {
    caches.open(cacheName).then(cache => {
    	cache.match(event.request).then(response => {
	      if (response) {
	      	return response;
	      }

	      return fetch(event.request)
	      .then(modifyTripResponse)
	    	.then(newResponse => {
	        cache.put(event.request, newResponse.clone());
	        return newResponse;
	  		});
	    });
    });
  }

  event.respondWith(	
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});