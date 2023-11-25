
echo "##############################################################"

echo "                   Run as a service...                        "

echo "##############################################################"

sudo cp mqttroute.service /lib/systemd/system/

if command /opt/Bevywise > /dev/null 2>&1; then

	echo "              Service direct Path Found             "

else 

	echo "          No such directory found in /opt      "


	cd ../../..

	echo "."

	echo "."

	echo "."

	echo "##############################################################"


	if [ -L /opt/Bevywise ]; then

		echo " 	   Service link path is already exist "

	else

		sudo ln -s "$(pwd)/Bevywise" /opt/Bevywise

		echo " 	  Service link path created done "

	fi


fi

echo "##############################################################"
echo "               Now you can Run As A Service                   "
echo "##############################################################"