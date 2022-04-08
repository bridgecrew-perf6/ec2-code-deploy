# Coldwave Deployment Cookbook

## Table of Contents
TODO

## AWS
### EC2 Instance
All following instructions should be called from the instance terminal itself via an ssh connection and are required to 
actually set up an instance correctly.
#### AWS CodeDeploy Agent
The [AWS CodeDeploy Agent](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install-linux.html)
will manage the execution of scripts after a deployment via git has happened. To install the agent run
```shell
sudo yum install ruby
sudo yum install wget
wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
```
You can verify that the installation was successful by calling
````shell
sudo service codedeploy-agent status
````
which should result in a terminal output in the form of ``The AWS CodeDeploy agent is running as PID XXXX``.
#### Node environment

### AWS CodeDeploy