const http = require('http');
const querystring = require('querystring');

const BASE_URL = 'http://localhost:5000/api';

// Utilities for making requests
function request(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🚀 Starting Endpoint Verification...');

    // 1. Auth: Register
    console.log('\nTesting Auth: Register...');
    const uniqueUser = `testuser_${Date.now()}`;
    const userPayload = {
        username: uniqueUser,
        email: `${uniqueUser}@example.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin' // Trying to register as admin to test admin routes
    };

    let authRes = await request('POST', '/users/register', userPayload);

    // If admin registration is restricted, try login or standard member
    let token = null;
    if (authRes.status === 201 || authRes.status === 200) {
        console.log('✅ Registration successful');
        token = authRes.body.token || authRes.body.data?.token; // Adjust based on actual response structure
    } else {
        console.log('⚠️ Registration failed:', authRes.body);
        // Try login just in case
        console.log('Trying login...');
        authRes = await request('POST', '/users/login', {
            email: userPayload.email,
            password: userPayload.password
        });
        if (authRes.status === 200) {
            console.log('✅ Login successful');
            token = authRes.body.token;
        } else {
            console.error('❌ Could not authenticate. Aborting tests.');
            return;
        }
    }

    if (!token) {
        // Based on user controller seen earlier, response might be { success: true, token: ..., data: ... }
        // Let's assume standard response
        if (authRes.body.token) token = authRes.body.token;
    }

    if (!token) {
        console.error('❌ No token received. Aborting.');
        return;
    }

    // 2. Gallery Tests
    console.log('\nTesting Gallery Endpoints...');
    const galleryPayload = {
        title: 'Test Gallery',
        description: 'Testing the gallery module',
        images: [{ url: 'http://example.com/image.jpg', caption: 'Test Image' }],
        albumType: 'general',
        visibility: 'public'
    };

    const createGalleryRes = await request('POST', '/gallery', galleryPayload, token);
    console.log(`POST /gallery: ${createGalleryRes.status} - ${createGalleryRes.body.success ? 'Success' : 'Failed'}`);

    const getGalleryRes = await request('GET', '/gallery', null, token);
    console.log(`GET /gallery: ${getGalleryRes.status} - ${getGalleryRes.body.success ? 'Success' : 'Failed'}`);


    // 3. Resource Tests
    console.log('\nTesting Resource Endpoints...');
    const resourcePayload = {
        title: 'Test Resource',
        description: 'Testing the resource module',
        resourceType: 'link',
        category: 'Prevention', // Using valid category from schema
        externalUrl: 'http://example.com',
        accessLevel: 'public'
    };

    const createResourceRes = await request('POST', '/resources', resourcePayload, token);
    console.log(`POST /resources: ${createResourceRes.status} - ${createResourceRes.body.success ? 'Success' : 'Failed'}`);

    const getResourceRes = await request('GET', '/resources', null, token);
    console.log(`GET /resources: ${getResourceRes.status} - ${getResourceRes.body.success ? 'Success' : 'Failed'}`);


    // 4. Story Tests
    console.log('\nTesting Story Endpoints...');
    const storyPayload = {
        title: 'Test Story',
        content: 'This is a test story content that needs to be reasonably long to be meaningful.',
        category: 'personal_journey',
        isAnonymous: false,
        status: 'draft'
    };

    const createStoryRes = await request('POST', '/stories', storyPayload, token);
    console.log(`POST /stories: ${createStoryRes.status} - ${createStoryRes.body.success ? 'Success' : 'Failed'}`);
    if (!createStoryRes.body.success) console.log('Error details:', JSON.stringify(createStoryRes.body, null, 2));

    const getStoryRes = await request('GET', '/stories', null, token);
    console.log(`GET /stories: ${getStoryRes.status} - ${getStoryRes.body.success ? 'Success' : 'Failed'}`);

    console.log('\n✨ Verification Complete');
    process.exit(0);
}

// Wait for server to potentially start
setTimeout(runTests, 3000);
