SET original_directory="%cd%"
cd C:\"Program Files"\MongoDB\Server\3.4\bin
mongo.exe --shell %original_directory%\Script2.js --port 27000
cd %original_directory%
pause