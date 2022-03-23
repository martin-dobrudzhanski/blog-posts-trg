import axios from 'axios';

// Create a new instance of axios to be used for network requests
const client = axios.create({
  baseURL: process.env.MWS_EXPONEA_URL,
  headers: {
    'X-Auth-MWS-Token': process.env.MWS_EXPONEA_TOKEN
  }
});

/**
 * Post booking data to mobilewaves exponea service
 *
 * @param {Object} params
 * @returns {Promise} response
 */
export async function postBookingData(params) {
  return client.post('/booking', params);
}
/**
 * Post newsletter signup to mobilewaves exponea service
 *
 * CURRENTLY NOT USED/IMPLEMENTED AT MOBILEWAVES
 *
 * @param {Object} params
 * @returns {Promise} response
 */
export async function postNewsletterData(params) {
  return client.post('/newsletter', params);
}
