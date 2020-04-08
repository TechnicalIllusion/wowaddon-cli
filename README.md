# Why?
I was trying to automate the process of updating wow addons in Ubuntu using Wine and did not have much luck. I found though that I could accomplish all tasks from the command line. This made me think, well maybe I can atleast make it easier right.

# How?
This package executes get requests on the curseforge api based on parameters from the command line arguments. Using yargs I build out the command line tool and used it to make getting the information for a WGET much easier. The way I use this is: 

<p>wget $(wowaddon-cli -i AddonIdNumber -f filenameToDownload)</p>

This causes the information passed from the node app to the wget command and downloads the zip package specified in the command. There are also a couple utility commands that can be used to find the information you need for the above command.

<p>wowaddon-cli -k addonName</p>
Searches for the top 10 package IDs based on your addonname.

<p>wowaddon-cli -k addonName -f true</p>
Gives the details needed for the wget command for the first package found with the name you give. 

I recommend using the -k only option to make sure your desired result is at the top of the list, then adjust the name you give to make it the top. This will give the best results when used with the wget command to pull the package.
