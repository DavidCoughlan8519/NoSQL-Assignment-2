REM #
REM #-------------------------------------------------#
REM #						      #
REM # 0. Set myName to the name of the computer       #
REM #						      #
REM #-------------------------------------------------#
REM #	Name of computer
SET myName=DESKTOP-1TJJLHJ
SET mongo=C:\"Program Files"\MongoDB\Server\3.0\bin
SET workspace=C:\Users\Asus\Desktop\Database\workspace
REM #
REM #-------------------------------------------------#
REM #						      #
REM # 1. Start the config server database instances   #
REM #						      #
REM #-------------------------------------------------#
REM #	
REM # 1.1. Create the data directory for each of the config servers
REM #	Makes the folders to simulate the different shards
mkdir %workspace%\cfg0
mkdir %workspace%\cfg1
mkdir %workspace%\cfg2
REM #	
REM # 1.2. Start the config server instances 
REM #	This starts the config server instances and gets it to listen to the passed port.
start /b %mongo%\mongod.exe --configsvr --dbpath %workspace%\cfg0 --port 26050
start /b %mongo%\mongod.exe --configsvr --dbpath %workspace%\cfg1 --port 26051
start /b %mongo%\mongod.exe --configsvr --dbpath %workspace%\cfg2 --port 26052

pause
REM #	
REM #-------------------------------------------------#
REM #						      #
REM # 2. Start the C:\MongoDB_3_0\bin\mongos instances   		      #
REM #						      #
REM #-------------------------------------------------#
REM #	
REM # 2.1. A first C:\MongoDB_3_0\bin\mongos process listens to the default port 27017
REM #	
start /b %mongo%\mongos.exe --configdb %myName%.local:26050,%myName%.local:26051,%myName%.local:26052

pause
REM #	
REM # 2.2. Remaining C:\MongoDB_3_0\bin\mongos 
REM # processes listen to the explicit ports assigned by us.
REM # mongos for MongoDb sharding is a routing service  for mongoDB shard configs that processes queries from the application layer
REM # and determines the location of this data in the sharded cluster in order to complete these operations.
REM #	
start /b %mongo%\mongos.exe --configdb %myName%.local:26050,%myName%.local:26051,%myName%.local:26052 --port 26061

pause
start /b %mongo%\mongos.exe --configdb %myName%.local:26050,%myName%.local:26051,%myName%.local:26052 --port 26062
pause
start /b %mongo%\mongos.exe --configdb %myName%.local:26050,%myName%.local:26051,%myName%.local:26052 --port 26063
pause
REM #	
REM #-------------------------------------------------#
REM #						                          #
REM # 3. Create the shards of our cluster	          #
REM #						                          #
REM #-------------------------------------------------#
REM #	
REM # 3.1. Create the data directory for each of the replica sets servers
REM #	Create the folders for our replication sets (mirror copies of the original encase one goes down.It can be isolated and worked on.)
mkdir %workspace%\dublin0
mkdir %workspace%\dublin1
mkdir %workspace%\dublin2
mkdir %workspace%\cork0
mkdir %workspace%\cork1
mkdir %workspace%\cork2
mkdir %workspace%\limerick0
mkdir %workspace%\limerick1
mkdir %workspace%\limerick2
mkdir %workspace%\galway0
mkdir %workspace%\galway1
mkdir %workspace%\galway2
REM #	
REM # 3.2. Start each member of the replica set 
REM #	These commands replicate the data to the replica sets on the listening ports provided.
pause
start /b %mongo%\mongod.exe --replSet dublin --dbpath %workspace%\dublin0 --port 27000
start /b %mongo%\mongod.exe --replSet dublin --dbpath %workspace%\dublin1 --port 27001
start /b %mongo%\mongod.exe --replSet dublin --dbpath %workspace%\dublin2 --port 27002
start /b %mongo%\mongod.exe --replSet cork --dbpath %workspace%\cork0 --port 27100
start /b %mongo%\mongod.exe --replSet cork --dbpath %workspace%\cork1 --port 27101
start /b %mongo%\mongod.exe --replSet cork --dbpath %workspace%\cork2 --port 27102
start /b %mongo%\mongod.exe --replSet limerick --dbpath %workspace%\limerick0 --port 27200
start /b %mongo%\mongod.exe --replSet limerick --dbpath %workspace%\limerick1 --port 27201
start /b %mongo%\mongod.exe --replSet limerick --dbpath %workspace%\limerick2 --port 27202
start /b %mongo%\mongod.exe --replSet galway --dbpath %workspace%\galway0 --port 27300
start /b %mongo%\mongod.exe --replSet galway --dbpath %workspace%\galway1 --port 27301
start /b %mongo%\mongod.exe --replSet galway --dbpath %workspace%\galway2 --port 27302
REM #	
