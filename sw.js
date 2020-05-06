var CACHE_NAME = 'cache-v2';
var urlsToCache = [
  "/",
  "/index.html",
  "/images/dog.jpg",
  "/images/cat.jpg",
  "/css/style.css",
  "/sw.js",
  "/indexddb.js",
  "/favicon.ico"
];

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").then(
      function(registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        )

        // registration.addEventListener('updatefound', () => {
        //   let newWorker = registration.installing
        //   console.log({ newWorker, registration})
        // })
      },
      function(err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err)
      }
    )
  })
}


self.addEventListener('install', function(event) {
  console.log('install')
  event.waitUntil(precache())
  // self.skipWaiting()
})


self.addEventListener('activate', function(event) {
  console.log('activate')
  const cacheKeepList = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeepList.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
  // event.waitUntil(clients.claim())
})


self.addEventListener('fetch', function(event) {
  if(event.request.url.indexOf('chrome-extension') === -1) {
    console.log('fetch')
    event.respondWith(fromCache(event.request))
    event.waitUntil(
      update(event.request)
      .then(refresh)
    )
    // event.respondWith(fromCache(event.request));

  }
});


function update(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      var message = {
        type: 'refresh',
        url: response.url,
        eTag: response.headers.get('ETag'),
        msg: "cac"
      };
      client.postMessage(JSON.stringify(message));
    });
  });
}

function precache() {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(urlsToCache);
  });
}

function fromCache(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match')
    });
  });
}

function fromNetwork(request) {
  if(navigator.onLine) {
    console.log('vao')
    return fetch(request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, response.clone());
        return response;
      });
    });
  }
  // console.log('deo vao')
  // return Promise.reject('no-match')
}
