SET original_directory="%cd%"
cd C:\"Program Files"\MongoDB\Server\3.4\bin
mongoimport.exe --db test --collection restaurants --drop --file %original_directory%\script4.json --port 27000
cd %original_directory%
pause



