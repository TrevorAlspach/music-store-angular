# Syncify - Music Store (Angular)

This repository contains the **Angular** frontend code for **Syncify**, which integrates with Spotify and Apple Music APIs to allow playlist management, synchronization, and playback within the app.

## Features
- **Okta Auth0 Authentication**: Secure login for users.
- **Spotify and Apple Music Integration**: View and manage playlists from both services.
- **Playlist Syncing**: Sync playlists between Spotify and Apple Music.
- **Web Players**: In-app music playback using Spotify and Apple Music web players.

## Prerequisites
- **Backend**: The app requires the **Spring Boot** backend, available [here](https://github.com/TrevorAlspach/music-store), running on `localhost:8080`.
- **Node.js** and **Angular CLI** installed locally.

## Installation

### Clone the repository
```bash
git clone https://github.com/TrevorAlspach/music-store-angular.git
cd music-store-angular
```
### Install dependencies
```bash
npm ci
```
###Running the app (Development)
By default, the app runs in development mode and expects the Spring Boot backend at localhost:8080.
Start the development server:
```bash
ng serve
```

## GitHub Actions

The repository is configured with **GitHub Actions** to automate builds and Docker image creation on every commit.

### Workflow Summary:
1. Build the Angular app using `ng build`.
2. Create and publish a Docker image for deployment.

The workflow configuration can be found in the `.github/workflows` directory.


