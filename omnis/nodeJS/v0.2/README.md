media 0.0.2
===========
Generated: 2020-10-19 at 11:36:47  
Author sebastien.mamy[@]gmail.com  


Use the media library
---------------------
* copy all files and directories to your local storage dessitation directory `[APP_DIR]`
* organize your MP3 library located in `[MP3_DIR]` in subdirectories: each mp3 file is places in a subdirectory named after the first letter of the file name. For example "The Police, Roxane.mp3" will be place in the `[MP3_DIR]/T` subdirectory
* name your MP3 files according to the naming convention given below
* access your library using the absolute path of the `[APP_DIR]`: in the address bar of the browser, key `file:\\[APP_DIR]\index.html`
* create a new library (library entry of the menu), and put the full path of `[MP3_DIR]` as the base directory
* in the `[IMG_DIR]`, store all the album covers, performers and creators pictures. Pictures should be square JPG files 


MP3 file name format
--------------------
* 2 fields: `[performer name], [title].mp3`
* 3 fields: `[performer name], [title], [creator name].mp3`
* 4 fields: `[performer name], [album title], [track number], [title].mp3`
* 6 fields: `[performer name], [album title], [track number], [title], [identifier], [creator name].mp3`


Image file name format
----------------------
* albums: `[performer name], [title].jpg`
* perfomers/creators: `[performer name].jpg`