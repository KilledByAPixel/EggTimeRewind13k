rem Simple build script for LittleJS by Frank Force
rem Minfies and combines index.html and index.js and zips the result
rem Run buildSetup.bat to install required dependencies.

set NAME=game
set BUILD_FOLDER=build
set BUILD_FILENAME=index.js

rem remove old files
del %NAME%.zip
rmdir /s /q %BUILD_FOLDER%

rem copy engine release build
mkdir %BUILD_FOLDER%
cd %BUILD_FOLDER%

rem add your game's files to include here
type ..\bonusGames.js >> %BUILD_FILENAME%
type ..\gameEngine.js >> %BUILD_FILENAME%
type ..\gameEngineDebug.js >> %BUILD_FILENAME%
type ..\webgl.js >> %BUILD_FILENAME%
type ..\game.js >> %BUILD_FILENAME%
echo. >> %BUILD_FILENAME%

rem copy images to build folder
copy ..\font.png font.png
copy ..\tiles.png tiles.png

rem minify code with closure
move %BUILD_FILENAME% %BUILD_FILENAME%.temp
call npx google-closure-compiler --js=%BUILD_FILENAME%.temp --js_output_file=%BUILD_FILENAME% --compilation_level=ADVANCED --language_out=ECMASCRIPT_2019 --warning_level=VERBOSE --jscomp_off=* --assume_function_wrapper
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)
del %BUILD_FILENAME%.temp

rem more minification with uglify or terser (they both do about the same)
call npx uglifyjs -o %BUILD_FILENAME% --compress --mangle -- %BUILD_FILENAME%
rem call terser -o %BUILD_FILENAME% --compress --mangle -- %BUILD_FILENAME%
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem roadroller compresses the code better then zip
copy %BUILD_FILENAME% roadroller_%BUILD_FILENAME%
call npx roadroller roadroller_%BUILD_FILENAME% -o roadroller_%BUILD_FILENAME%
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem build the html, you can add html header and footers here
rem type ..\header.html >> index.html
echo ^<body^>^<meta charset=utf-8^>^<script^> >> index.html
type roadroller_%BUILD_FILENAME% >> index.html
echo ^</script^> >> index.html

rem zip the result, ect is recommended
call ..\node_modules\ect-bin\vendor\win32\ect.exe -9 -strip -zip ..\%NAME%.zip index.html
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

cd ..

rem pause to see result