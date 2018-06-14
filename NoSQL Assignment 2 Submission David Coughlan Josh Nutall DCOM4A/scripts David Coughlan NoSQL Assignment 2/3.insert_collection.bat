REM #
REM #---------------------------------------------------#
REM #						        #
REM # 5. Insert collection from File		        #
REM #						        #
REM #---------------------------------------------------#
REM #	
SET original_directory="%cd%"
cd C:\"Program Files"\MongoDB\Server\3.0\bin
mongoimport.exe --db test --collection restaurants --drop --file %original_directory%\3.restaurants_dataset.json --port 27000
cd %original_directory%
pause
REM #



