//----------------------------------------------------
//
//  CREATE AND INITIATE THE REPLICA SETS AND SHARDS
//
//----------------------------------------------------
//
//------------------------------------------------
// 1. GLOBAL VARIABLES (I don't understand this)
//------------------------------------------------
//
db = db.getSisterDB("test");
var res = null;
//
//------------------------------------------------
// 2. ENABLING THE DATABASE FOR SHARDING
//------------------------------------------------
//
res = sh.enableSharding("test");
while (res.ok != 1) {
    sleep(10);
    if (res.ok != 1){
        print("Enable test for Sharding Failed. Trying it again");
        res = sh.enableSharding("test");
    }
}
print("test Enable for Sharding!");
//
//------------------------------------------------
// 3. CREATE INDEX FOR THE DATABASE
//------------------------------------------------
//
res = db.restaurants.createIndex({ "cuisine" : 1, "borough" : 1 });
while (res.ok != 1) {
    sleep(10);
    if (res.ok != 1){
        print("Creating index for restaurants collection failed. Trying it again");
        res = db.restaurants.createIndex({ "cuisine" : 1, "borough" : 1 });
    }
}
print("restaurant Collection Index Created!");
//
//------------------------------------------------
// 4. SHARD THE COLLECTION
//------------------------------------------------
//
res = sh.shardCollection("test.restaurants", { "cuisine" : 1, "borough" : 1 } );
while (res.ok != 1) {
    sleep(10);
    if (res.ok != 1){
        print("Sharding restaurants collection failed. Trying it again");
        res = sh.shardCollection("test.restaurants", { "cuisine" : 1, "borough" : 1 } );
    }
}
print("restaurant Collection Sharded!");
//
//------------------------------------------------
// 5. Print the status
//------------------------------------------------
//
for (i = 0; i < 20; i++) {
    sh.status();
    sleep(10000);
}
//
//------------------------------------------------
// 7. QUIT
//------------------------------------------------
//
quit()


