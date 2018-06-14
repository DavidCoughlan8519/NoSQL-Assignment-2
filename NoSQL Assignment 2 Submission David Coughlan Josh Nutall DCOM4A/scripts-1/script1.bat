SET workspace=C:\Users\Asus\Documents\Neo4j\assign2
SET mongo=C:\"Program Files"\MongoDB\Server\3.4\bin
REM #
mkdir %workspace%\dublin0
mkdir %workspace%\dublin1
mkdir %workspace%\dublin2
REM #
start %mongo%\mongod --replSet dublin --dbpath %workspace%\dublin0 --port 27000&
start %mongo%\mongod --replSet dublin --dbpath %workspace%\dublin1 --port 27001&
start %mongo%\mongod --replSet dublin --dbpath %workspace%\dublin2 --port 27002&
pause
