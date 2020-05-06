const VERSION_DB = 2
const DB_NAME = "toDoList"

function myIndexedDB() {
  const DBOpenRequest = window.indexedDB.open(DB_NAME, VERSION_DB);

  DBOpenRequest.onupgradeneeded = function (event) {
    console.log("onupgradeneeded")
    this.db = event.target.result;
    console.log(DBOpenRequest.result.objectStoreNames)
    this.db.onerror = function(event) {
      console.log("onupgradeneeded error", { event })
    }

    if(!this.db.objectStoreNames.contains("toDoList")) {
      this.objectStore = this.db.createObjectStore(DB_NAME, { keyPath: "id", autoIncrement:true});
      // define what data items the objectStore will contain
      // objectStore.createIndex("id", "id", { unique: true });
    }

  }.bind(this)

  DBOpenRequest.onsuccess = function (event) {
    this.db = event.target.result
  }.bind(this)
}

myIndexedDB.prototype.addItem = function(item) {
  const transaction = this.db.transaction(DB_NAME, "readwrite");
  transaction.oncomplete = function(event) {
    console.log("addItem: transaction complete")
  };

  transaction.onerror = function(event) {
    console.log("addItem: transaction error", event.target.error.name)
  };

  const objectStore = transaction.objectStore(DB_NAME)
  const objectStoreRequest = objectStore.get(item.id)
  objectStoreRequest.onsuccess = function(event) {
    if(!event.target.result) {
      objectStore.add(item)
    } else {
      objectStore.put(item)
    }
  }
}

myIndexedDB.prototype.updateItem = function(item) {
  const transaction = this.db.transaction(DB_NAME, "readwrite");
  transaction.oncomplete = function(event) {
    console.log("updateItem: transaction complete")
  };

  transaction.onerror = function(event) {
    console.log("updateItem: transaction error", event.target.error.name)
  };

  const objectStore = transaction.objectStore(DB_NAME)
  objectStore.get(item.id).onsuccess = function(event) {
    if(event.target.result) objectStore.put(item)
  }
}


myIndexedDB.prototype.deleteItem = function(key) {
  const transaction = this.db.transaction(DB_NAME, "readwrite");
  transaction.oncomplete = function(event) {
    console.log("deleteItem: transaction complete")
  };

  transaction.onerror = function(event) {
    console.log("deleteItem: transaction error", event.target.error.name)
  };

  const objectStore = transaction.objectStore(DB_NAME)
  objectStore.delete(key)
}

myIndexedDB.prototype.deleteAllItem = function() {
  const transaction = this.db.transaction(DB_NAME, "readwrite");
  transaction.oncomplete = function(event) {
    console.log("deleteAllItem: transaction complete")
  };

  transaction.onerror = function(event) {
    console.log("deleteAllItem: transaction error", event.target.error.name)
  };

  const objectStore = transaction.objectStore(DB_NAME)
  objectStore.clear()
}

myIndexedDB.prototype.getItem = function(key) {
  const transaction = this.db.transaction(DB_NAME, "readonly");
  transaction.oncomplete = function(event) {
    console.log("getItem: transaction complete")
  };

  transaction.onerror = function(event) {
    console.log("getItem: transaction error", event.target.error.name)
  };

  const objectStore = transaction.objectStore(DB_NAME)
  const objectStoreRequest = objectStore.get(key)

  return new Promise((resolve, reject) => {
    objectStoreRequest.onsuccess = function(event) {
      resolve(event.target.result)
    }

    objectStoreRequest.onerror = function() {
      reject(event)
    }
  })
}

myIndexedDB.prototype.getAllItem = function() {
  const transaction = this.db.transaction(DB_NAME, "readonly");
  transaction.oncomplete = function(event) {
    console.log("getAllItem: transaction complete")
  };

  transaction.onerror = function(event) {
    console.log("getAllItem: transaction error", event.target.error.name)
  };

  const objectStore = transaction.objectStore(DB_NAME)
  const objectStoreRequest = objectStore.getAll()

  return new Promise((resolve, reject) => {
    objectStoreRequest.onsuccess = function(event) {
      resolve(event.target.result)
    }

    objectStoreRequest.onerror = function() {
      reject(event)
    }
  })
}

myIndexedDB.prototype.close = function() {
  this.db.close()
}
