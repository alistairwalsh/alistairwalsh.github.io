It will be SQL week here at NeuralCode. If you are a database ninja please share your dbfu. If you're a noob like the rest of us, join in and we'll work this out together.
Databases are neat and cool! Cool because they run lots of data really fast without suffering the sluggish performance of spreadsheets and Neat because fields can be defined very precisely and strictly to maintain data accuracy. A database can have many tables that relate to one another and store relevant information together, that is still available to other tables and to SQL queries. Databases can also store much more than text and numeric data. Images, video, audio, whole documents, and references, can all be stored along with the information about them. It is this feature that i really appealing when you are handling lots of complex data related to an experiment. It might just keep your information organised in a manner that will make it useful to others and still useful to you in five years time.
Databases will save you when that excel file starts to slow down (each scroll down takes a few seconds) or is so complicated that no-one can remember what parts of the 15 sheets is involved in calculating the values for the 16th.
Phil has some databases of word frequency from different sources. They are already sluggish (150,000 entries on the one excel file we were playing with on friday). There is some redundancy and even a little error. The aim is to combine all the information into a database and extract the information relevant to the word list Phil will use in his upcoming experiment.

If you are using a mac - open a terminal window and type
  >sqlite3

you will start sqlite3 on the command line. We will progress toward using sqlite3 from within the ipython notebook but now it might be easier to understand in this simple format.


-----------------------------------------
There are two types of commands I'm going to show you. Some start with a

  >.

like

  >.help

this is how you can give instructions to the database engine, the rest of the commands are in the SQL language and that is how we create and query the information in our database.

Right now, if you are at the sqlite prompt, you can prettify the output by entering the following

  >.headers on
  >.mode columns

This will cause the output to include headers and align the output in columns. Much nicer and easier to read.

-------------------------------------------
 


The SQL CREATE TABLE Statement

The CREATE TABLE statement is used to create a table in a database.

Tables are organized into rows and columns; and each table must have a name.

SQL CREATE TABLE Syntax

>CREATE TABLE table_name

>(

>column_name1 data_type(size),

>column_name2 data_type(size),

>column_name3 data_type(size),

>....

>);


How to write output of an SQL query to a csv

>sqlite> .mode csv
  
>sqlite> .separator ,

>sqlite> .output test_file_1.csv

>sqlite> select * from tbl2;

>sqlite> .exit

>Psycholinguistic_databases Wintermute$ cat test_file_1.csv

>id,word

>0,aaron

>1,aargh

>Psycholinguistic_databases Wintermute$

