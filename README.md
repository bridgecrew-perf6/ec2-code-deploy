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