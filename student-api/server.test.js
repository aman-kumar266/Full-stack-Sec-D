import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'node:http';
import app from './server.js';

// Lightweight integration tests using a temporary ephemeral port.
test('server module exports an Express app', () => {
  assert.equal(typeof app, 'function');
  assert.equal(typeof app.use, 'function');
});
