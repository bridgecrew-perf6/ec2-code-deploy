# Coldwave EC2 Deployment Cookbook
## Setup
### EC2 Instance
Connect via ssh to the instance to access the command line and run the following commands to set up the instance.
  1. Update yum. Optional, but considered best practices.
        ```shell
        sudo yum update -y
        ```
  2. Install nodejs. Currently, nodejs version 14 should be deployed.
        ```shell
        curl -fsSL https://rpm.nodesource.com/setup_14.x | sudo bash -
        sudo yum install -y nodejs
        ```
  3. Install the nodejs process manager pm2
     ````shell
     sudo npm install pm2 -g
     ````
  4. [Create a Personal Access Token](https://github.com/settings/tokens) with the `read:packages` scopes. 
  5. Add the token to the npm config
        ````shell
        npm config set //npm.pkg.github.com/:_authToken <<TOKEN>>
        ````
     Steps 3 and 4 might need to be repeated if you want the update the internal imagineon packages (`flakejs` and `coldwave-backend-environment`)
     and the token is invalid or timed out.
  6. Install git
        ````shell
         sudo yum install -y git
        ````
  7. Create an ssh key for github
        ````shell
        ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
        eval "$(ssh-agent -s)"
        ssh-add ~/.ssh/id_rsa
        cat .ssh/id_rsa.pub
        ````
     Copy the console output of the last command and add the new ssh key at github to your [profile](https://github.com/settings/keys).
  8. Get the code. If you simply want to clone a repository, run
        ````shell
        git clone <<Repository>>
        ````
     However, since you will most likely be using the ``coldwave-backend-bundles`` repository it is highly recommended to only
     checkout the code you actually need. On the one hand you save memory on the instance, because it is unforeseen how
     large the repository will grow. On the other hand the other bundle directories may contain sensible information
     that should not be available to all ec2 instances. To clone the repository run
        ````shell
        git config --global init.defaultBranch main
        mkdir repo
        cd repo
        git init
        git sparse-checkout init
        git sparse-checkout add bundles/<<BUNDLE_NAME>>
        git remote add -f origin git@github.com:imagineon/coldwave-backend-bundles.git
        git pull origin main
        ````
  9. Install top level dependencies
        ````shell
        npm install
        ````
  10. Install bundle dependencies and compile
        ````shell
        npx gulp compile --client=<<DIRECTORY_NAME>>
        ````
  11. Update required environment parameter if any
       ````shell
       cd bundles/<<DIRECTORY_NAME>
       nano app.config.js
       ````
      Change required environment parameter. The database name should be `xxxx-coldwave-db`
  12. Start the process from the current directory
       ````shell
       pm2 start app.config.js
       ````

## Future Features
* Create a script that automates the commands above. One drawback of the script is, that if it encounters errors, you can only run the complete script again. This is why I currently favor the more labor-intensive approach while I am learning the ins and outs of the ec2 image.
* Create an image where everything is predefined and preinstalled. Then add a config file (needs to be generated somehow) to the deployment which should run the backend.