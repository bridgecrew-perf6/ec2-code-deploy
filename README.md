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
  3. [Create a Personal Access Token](https://github.com/settings/tokens) with the `read:packages` scopes. 
  4. Add the token to the npm config
        ````shell
        npm config set //npm.pkg.github.com/:_authToken <<TOKEN>>
        ````
     Steps 3 and 4 might need to be repeated if you want the update the internal imagineon packages (`flakejs` and `coldwave-backend-environment`)
     and the token is invalid or timed out.
  5. Install git
        ````shell
         sudo yum install -y git
        ````
  6. Create an ssh key for github
        ````shell
        ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
        eval "$(ssh-agent -s)"
        ssh-add ~/.ssh/id_rsa
        cat .ssh/id_rsa.pub
        ````
     Copy the file content and add the new ssh key at github to your [profile](https://github.com/settings/keys).
  7. Get the code. If you simply want to clone a repository, run
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
  8. Install top level dependencies
        ````shell
        npm install
        ````
  9. Install bundle dependencies and compile
       ````shell
       npx gulp compile --client=<<DIRECTORY_NAME>>
       ````
  10. Install the nodejs process manager pm2
        ````shell
        sudo npm install pm2 -g
        ````
  11. Start the process from the correct directory
        ````shell
        cd bundles/<<DIRECTORY_NAME>
        pm2 start dist/index.js
        ````

# KINDA DEPRECATED
__The following guide is most likely not applicable / out-of-date because we use a different form of code deployment__

### Setup
3. Install [AWS CodeDeploy Agent](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install-linux.html)
      ```shell
      sudo yum install ruby
      sudo yum install wget
      wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install
      chmod +x ./install
      sudo ./install auto
      sudo service codedeploy-agent status
      ```
   You should see a message in the form of ``The AWS CodeDeploy agent is running as PID XXXX``
### AWS CodeDeploy Service
1. Navigate to the CodeDeploy AWS service
2. Create an application with ``EC2`` as compute platform (_This step requires authorization to perform action codedeploy:CreateApplication_).
   The name should follow our standard and end with `-cd`, short for `CodeDeploy`.
3. Create a deployment group. The name should follow our standard and end with `-dg`, short for `DeploymentGroup`.
   For _Deployment type_ choose `in place`. This is subject to change since this will result in down-time of the application.
   However, it is the least invasiv method for now and deployments could be made outside of working hours. The other option is
   a blue/green deployment which includes a load balancer. You want to add an ``Amazon EC2 instance``-tag which should
   be the name of the EC2 instance. If naming was done properly it should be the name of the deployment group but ending with `-ec2`.
   The key for the tag is `name`. Choose `OneAtATime` deployment (we currently are running a single instance anyway) and
   disable the load balancer. Choose not to install the agent. This was done in the [ec2 setup](#ec2-instance). Add
   the service role ``ServiceRoleForCodeDeploy``. This role will (currently) be used to access the ec2 instance. In further
   revision this role should be tailored to the specifig ec2 instance and only grant access to one instance.

## Resources
[appspec file](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html);