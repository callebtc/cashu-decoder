# Cashu Token Parser Web

A web-based tool for parsing and editing Cashu tokens. This application provides a split-screen interface where you can paste Cashu tokens on one side and see/edit the parsed JSON on the other side.

## Features

- Split-screen interface for token input and JSON visualization
- Real-time token parsing and validation
- JSON editing capabilities
- Dark/Light mode support
- Responsive design

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cashu-parser-web.git
   cd cashu-parser-web
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Production Build

1. Create a production build:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

3. Deploy the contents of the `dist` directory to your web server.

## Environment Variables

No environment variables are required for basic functionality. The application runs entirely in the browser.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
