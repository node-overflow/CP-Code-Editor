#!/usr/bin/env bash
set -e

# Update apt repo and install g++
apt-get update
apt-get install -y g++

# Install Node.js deps
npm install
