# EC2 Cookbook


## Setup
### EC2 Instance
Connect via ssh to the instance to access the command line and run the following commands to setup the instance.
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

### DEBUGGING 
```shell
[ec2-user@ip-10-0-1-6 ~]$ sudo iptables -L -v
Chain INPUT (policy ACCEPT 76 packets, 5680 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain OUTPUT (policy ACCEPT 72 packets, 4566 bytes)
 pkts bytes target     prot opt in     out     source               destination
```