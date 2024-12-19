# TrackIt

TrackIt is a web-based application that simplifies shipment tracking by providing a unified platform to monitor your packages' status and journey, across various couriers.

![Preview](https://github.com/GuruUpdesh/track-it/assets/62634868/26d8a1ab-1eab-4cc4-aa8a-108a9dc61bce)

[Live Production Website](https://tackit.guruupdeshsingh.dev/) | [User Guide](https://tackit.guruupdeshsingh.dev/user-guide)

## Features

![Features Board](https://github.com/GuruUpdesh/track-it/assets/62634868/3e1194e7-70aa-48ee-aaf9-405f2a2c0689)

- **Centralized Tracking Dashboard**: Consolidated view of shipments and their current statuses.
- **Multi-Courier Support**: Tracking support for UPS, USPS, FedEx, OnTrac, and more.
- **Detailed Tracking History**: View status, location, and date information for each shipment.
- **Easy Management**: Add, delete, and update your shipments with ease.
- **Clear and easy to understand UI**: Intuitive and responsive design for a seamless user experience. With mobile support for tracking on the go.
- **Power User Features**: Search and filter functionality, undo accidental deletions, shortcuts, and links to courier websites.

## Setup development environment

### Required

- Node.js v18+ (https://nodejs.org/en/download/)
- NPM v7+ (https://www.npmjs.com/get-npm)

### Install

Clone the repository

```bash
git clone https://github.com/GuruUpdesh/track-it.git
```

Install dependencies

```bash
npm install
npx husky install
```

Run the development server

```bash
npm run dev
```

## Testing

### Unit Tests

```bash
npm run test
```

### Cypress End-to-End Tests (with Cypress GUI)

```bash
npm run cypress
```

### Cypress End-to-End Tests (Headless)

```bash
npm run cypress:headless
```
