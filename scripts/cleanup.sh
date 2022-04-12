#!/bin/bash
# Due to the fact, that some files should not be overwritten by AWS CodeDeploy and we can not specifically list those
# files, we need to remove files that should be updated regardless.
cd /home/ec2-user/app/ || exit # Exiting early so we do not delete other directories
rm -rf -v !("node_modules")