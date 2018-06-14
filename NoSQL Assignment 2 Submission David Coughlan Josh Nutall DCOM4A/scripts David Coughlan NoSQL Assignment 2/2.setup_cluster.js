//----------------------------------------------------
//
//  CREATE AND INITIATE THE REPLICA SETS AND SHARDS
//
//----------------------------------------------------
//
//------------------------------------------------
// 0. Set myName to the name of the computer
//------------------------------------------------
//
var myName = "DESKTOP-1TJJLHJ";
//
//------------------------------------------------
// 1. GLOBAL VARIABLES (I don't understand this)
//------------------------------------------------
//
db = db.getSisterDB("config");
var mongosConn = db;
var res = null;
//
//------------------------------------------------
// 2. SET THE CHUNK SIZE
//------------------------------------------------
//
db.settings.save( { _id:"chunksize", value: 1 } )
//
//------------------------------------------------
// 3. DUBLIN
//------------------------------------------------
//
// 1. CONNECT TO THE PROPER mongod PROCESS
//
db = connect(myName + ".local:27000/test");
//
// 2. INITIATE THE REPLICA SET
//
res = rs.initiate(
    {
        "_id" : "dublin",
        "members" : [
            { _id:0,host:myName+".local:"+"27000" },
            { _id:1,host:myName+".local:"+"27001" },
            { _id:2,host:myName+".local:"+"27002" }
        ]
    }
);
//
// 3. WAIT UNTIL ALL THE NODES OF THE REPLICA SET ARE UP AND RUNNING
//
while (res.ok != 1){
    sleep(10);
}
print("Dublin Replica Set Created!");
while (((rs.status().members[0].state != 1) && (rs.status().members[0].state != 2)) || ((rs.status().members[1].state != 1) && (rs.status().members[1].state != 2)) || ((rs.status().members[2].state != 1) && (rs.status().members[2].state != 2))) {
    sleep(10);
}
print("Dublin Replica Set Up!");
//
// 4. ADD THE SHARD
//
db = mongosConn;
res = sh.addShard("dublin/"+myName+".local:27000");
while (res.ok != 1){
    sleep(60);
    if (res.ok != 1){
        print("Adding Shard Failed. Trying it again");
        res = sh.addShard("dublin/"+myName+".local:27000");
    }
}
print("Dublin Shard Added!");
//
//------------------------------------------------
// 4. CORK
//------------------------------------------------
//
// 1. CONNECT TO THE PROPER mongod PROCESS
//
db = connect(myName+".local:27100/test");
//
// 2. INITIATE THE REPLICA SET
//
res = rs.initiate(
    {
        "_id" : "cork",
        "members" : [
            { _id:0,host:myName+".local:"+"27100" },
            { _id:1,host:myName+".local:"+"27101" },
            { _id:2,host:myName+".local:"+"27102" }
        ]
    }
);
//
// 3. WAIT UNTIL ALL THE NODES OF THE REPLICA SET ARE UP AND RUNNING
//
while (res.ok != 1){
    sleep(10);
}
print("Cork Replica Set Created!");
while (((rs.status().members[0].state != 1) && (rs.status().members[0].state != 2)) || ((rs.status().members[1].state != 1) && (rs.status().members[1].state != 2)) || ((rs.status().members[2].state != 1) && (rs.status().members[2].state != 2))) {
    sleep(10);
}
print("Cork Replica Set Up!");
//
// 4. ADD THE SHARD
//
db = mongosConn;
res = sh.addShard("cork/"+myName+".local:27100");
while (res.ok != 1){
    sleep(60);
    if (res.ok != 1){
        print("Adding Shard Failed. Trying it again");
        res = sh.addShard("cork/"+myName+".local:27100");
    }
}
print("Cork Shard Added!");
//
//------------------------------------------------
// 5. LIMERICK
//------------------------------------------------
//
// 1. CONNECT TO THE PROPER mongod PROCESS
//
db = connect(myName+".local:27200/test");
//
// 2. INITIATE THE REPLICA SET
//
res = rs.initiate(
    {
        "_id" : "limerick",
        "members" : [
            { _id:0,host:myName+".local:"+"27200" },
            { _id:1,host:myName+".local:"+"27201" },
            { _id:2,host:myName+".local:"+"27202" }
        ]
    }
);
//
// 3. WAIT UNTIL ALL THE NODES OF THE REPLICA SET ARE UP AND RUNNING
//
while (res.ok != 1){
    sleep(10);
}
print("Limerick Replica Set Created!");
while (((rs.status().members[0].state != 1) && (rs.status().members[0].state != 2)) || ((rs.status().members[1].state != 1) && (rs.status().members[1].state != 2)) || ((rs.status().members[2].state != 1) && (rs.status().members[2].state != 2))) {
    sleep(10);
}
print("Limerick Replica Set Up!");
//
// 4. ADD THE SHARD
//
db = mongosConn;
res = sh.addShard("limerick/"+myName+".local:27200");
while (res.ok != 1){
    sleep(60);
    if (res.ok != 1){
        print("Adding Shard Failed. Trying it again");
        res = sh.addShard("limerick/"+myName+".local:27200");
    }
}
print("Limerick Shard Added!");
//
//------------------------------------------------
// 6. GALWAY
//------------------------------------------------
//
// 1. CONNECT TO THE PROPER mongod PROCESS
//
db = connect(myName+".local:27300/test");
//
// 2. INITIATE THE REPLICA SET
//
res = rs.initiate(
    {
        "_id" : "galway",
        "members" : [
            { _id:0,host:myName+".local:"+"27300" },
            { _id:1,host:myName+".local:"+"27301" },
            { _id:2,host:myName+".local:"+"27302" }
        ]
    }
);
//
// 3. WAIT UNTIL ALL THE NODES OF THE REPLICA SET ARE UP AND RUNNING
//
while (res.ok != 1){
    sleep(10);
}
print("Galway Replica Set Created!");
while (((rs.status().members[0].state != 1) && (rs.status().members[0].state != 2)) || ((rs.status().members[1].state != 1) && (rs.status().members[1].state != 2)) || ((rs.status().members[2].state != 1) && (rs.status().members[2].state != 2))) {
    sleep(10);
}
print("Galway Replica Set Up!");
//
// 4. ADD THE SHARD
//
db = mongosConn;
res = sh.addShard("galway/"+myName+".local:27300");
while (res.ok != 1){
    sleep(60);
    if (res.ok != 1){
        print("Adding Shard Failed. Trying it again");
        res = sh.addShard("galway/"+myName+".local:27300");
    }
}
print("Galway Shard Added!");
//
//------------------------------------------------
// 7. QUIT
//------------------------------------------------
//
quit()
