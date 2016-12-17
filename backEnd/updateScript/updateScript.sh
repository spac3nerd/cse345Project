#!/bin/bash

mysql -u root -h localhost<<MYSQLRedirect
	use carProject;
	UPDATE Technician SET D1 = D2;
	UPDATE Technician SET D2 = D3;
	UPDATE Technician SET D3 = D4;
	UPDATE Technician SET D4 = D5;
	UPDATE Technician SET D5 = D6;
	UPDATE Technician SET D6 = D7;
	UPDATE Technician SET D7 = "00000000";
	exit
MYSQLRedirect
echo "done!"