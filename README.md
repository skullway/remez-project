# Remez 24 Analytics

The Remez 24 analytics project supplies statistics for the choring system of our Remez 24 apartment.

## Deployment

1. Use the package manager [npm](https://www.npmjs.com/) to install the node modules.
* note that on /frontend and /functions, you need to use `npm i` individually.
```bash
npm install
```
2. Create a .env file (in frontend folder) and add the variables listed on [your firebase project](https://console.firebase.google.com/) > Project Settings > General
Also, remember adding a variable called `VITE_API_BASE_URL` that will refer to the cloud functions API (for production it should contain the server and the project name & for development/testing it should point to localhost with the designated port and the correct routing)

### Deploying to Production:

3. In ./frontend, make sure you've bundled the updated code
```bash
npm run build
```
4. Run the firebase deployment on the root directory.
```bash
firebase deploy --only "functions,frontend"
```

### Deploying for Development/Testing:
3. Make sure to add environment variable VITE_DEV to your .env file and set it to true to run the authentication emulator (which will save users temporarily on your local files).
`VITE_DEV=false`
4. from ./frontend run the frontend using `npm run dev` and from ./functions run the backend using `npm run serve`
5. Preferably, you can add a variable named `VITE_IS_PUSH_FAKE_DATA` and set it to true for entering a load of fake data or a variable named `VITE_IS_CLEAN_COLLECTION` to clean your collection (both can be customised in `/frontend/index.js`)

## License

MIT License

Copyright (c) [2025] [skullway]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
