#!/bin/bash
# Colors
NC='\033[0m'
YELLOW='\033[1;33m'
# DARK_YELLOW='\033[0;33m'
GREEN='\033[1;32m'
DARK_GREEN='\033[0;32m'
RED='\033[1;31m'
DARK_RED='\033[0;31m'
AQUA='\033[1;36m'
DARK_AQUA='\033[0;36m'
PURPLE='\033[1;35m'
DARK_PURPLE='\033[0;35m'
DARK_GRAY='\033[1;30m'

# Utils
HEAD="${DARK_RED}[dang\$\$]${DARK_GRAY}${DARK_PURPLE}[${PURPLE}deploy-k8s${DARK_PURPLE}]${NC}"
INI="${DARK_AQUA}[${AQUA}INI${DARK_AQUA}]${NC}"
ACK="${DARK_GREEN}[${GREEN}ACK${DARK_GREEN}]${NC}"
CALL="${DARK_AQUA}[${AQUA}CALL${DARK_AQUA}]${NC}"
WARN="${DARK_YELLOW}[${YELLOW}WARN${DARK_YELLOW}]${NC}"
ERR="${DARK_RED}[${RED}ERR${DARK_RED}]${NC}"

# Config
IMAGE_NAME="martin7012001/dingomc-net-client"
VERSION_FILE="VERSION"
DEPLOYMENT_NAME="dingomc-net-client"
CONTAINER_NAME="dingomc-net-client"

function header {
  printf '%s[%s%s%s]%s%s' "$NC" "$DARK_GRAY" "$(date '+%Y-%m-%d %H:%M:%S.%N')" "$NC" "$HEAD" "$NC"
}

# Bump the version
bump_version() {
  local version=$1
  local bump_type=$2
  IFS='.' read -r -a version_parts <<< "$version"
  case $bump_type in
    patch)
      version_parts[2]=$((version_parts[2]+1))
      ;;
    minor)
      version_parts[1]=$((version_parts[1]+1))
      version_parts[2]=0
      ;;
    major)
      version_parts[0]=$((version_parts[0]+1))
      version_parts[1]=0
      version_parts[2]=0
      ;;
    *)
      echo -e "$(header)${ERR} ${RED}Invalid bump type. Use 'patch', 'minor', or 'major'.${NC}"
      exit 1
      ;;
  esac
  # Rebuild the version string
  echo "${version_parts[0]}.${version_parts[1]}.${version_parts[2]}"
}

# Check if the version file exists
if [ ! -f "$VERSION_FILE" ]; then
  echo "v1.0.0" > $VERSION_FILE
fi

# Read the current version from the file
CURRENT_VERSION=$(cat $VERSION_FILE)

# Bump the version if a bump type is provided
if [ "$1" == "minor" ] || [ "$1" == "major" ] || [ "$1" == "patch" ]; then
  NEW_VERSION=$(bump_version "$CURRENT_VERSION" "$1")
else
  NEW_VERSION=$(bump_version "$CURRENT_VERSION" patch)
fi

# Script start
echo -e "$(header)${INI} Running deployment script...${NC}"

# Build docker image
echo -e "$(header)${CALL} ${YELLOW}Building Docker image ${DARK_AQUA}${IMAGE_NAME}:${NEW_VERSION}${YELLOW}...${NC}"
docker-compose build
if [ $? -ne 0 ]; then
  echo -e "$(header)${ERR} ${RED}Docker build failed!${NC}"
  exit 1
fi
echo -e "$(header)${ACK} ${GREEN}Docker image built successfully!${NC}"

# Tag the image
echo -e "$(header)${CALL} ${YELLOW}Tagging Docker image as ${DARK_AQUA}${IMAGE_NAME}:${NEW_VERSION}${YELLOW}...${NC}"
docker tag "client-$CONTAINER_NAME:latest" "$IMAGE_NAME:$NEW_VERSION"
if [ $? -ne 0 ]; then
  echo -e "$(header)${ERR} ${RED}Docker tag failed!${NC}"
  exit 1
fi
echo -e "$(header)${ACK} ${GREEN}Docker image tagged successfully!${NC}"

# Remove old images
echo -e "$(header)${CALL} ${YELLOW}Removing old Docker images...${NC}"
docker rmi "client-$CONTAINER_NAME:latest"
if [ $? -ne 0 ]; then
  echo -e "$(header)${WARN} ${YELLOW}Docker image removal failed! Please delete it manually!${NC}"
else
  echo -e "$(header)${ACK} ${GREEN}Old Docker images removed successfully!${NC}"
fi

# Push docker image to Docker Hub
echo -e "$(header)${CALL} ${YELLOW}Pushing Docker image ${DARK_AQUA}${IMAGE_NAME}:${NEW_VERSION}${YELLOW}...${NC}"
docker push "$IMAGE_NAME:$NEW_VERSION"
if [ $? -ne 0 ]; then
  echo -e "$(header)${ERR} ${RED}Docker push failed!${NC}"
  exit 1
fi
echo -e "$(header)${ACK} ${GREEN}Docker image pushed successfully!${NC}"

# Update Kubernetes deployment
echo -e "$(header)${CALL} ${YELLOW}Updating Kubernetes deployment ${DARK_AQUA}${DEPLOYMENT_NAME}${YELLOW}...${NC}"
microk8s kubectl set image deployment/"$DEPLOYMENT_NAME" "$CONTAINER_NAME"=$IMAGE_NAME:"$NEW_VERSION"
if [ $? -ne 0 ]; then
  echo -e "$(header)${ERR} ${RED}Kubernetes deployment update failed!${NC}"
  exit 1
fi
echo -e "$(header)${ACK} ${GREEN}Kubernetes deployment updated successfully!${NC}"

# Wait for the deployment to complete
echo -e "$(header)${CALL} ${YELLOW}Waiting for deployment to complete...${NC}"
microk8s kubectl rollout status deployment/"$DEPLOYMENT_NAME"
if [ $? -ne 0 ]; then
  echo -e "$(header)${ERR} ${RED}Deployment rollout failed!${NC}"
  exit 1
fi
echo -e "$(header)${ACK} ${GREEN}Deployment rollout completed successfully!${NC}"

# Update the version file
echo "$NEW_VERSION" > $VERSION_FILE

echo -e "$(header)${ACK} ${GREEN}Version updated to ${DARK_AQUA}${NEW_VERSION}${GREEN}!${NC}"
echo -e "$(header)${ACK} ${GREEN}Deployment script completed successfully!${NC}"
