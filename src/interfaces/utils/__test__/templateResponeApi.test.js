const {toTemplateResponseApi} = require('../templateResponeApi');

describe('toTemplateResponseApi', () => {
    it('should return the correct response object', () => {
        const params = {
            request_id: '12345',
            status: 'Success',
            message: 'Operation completed successfully',
            data: { key: 'value' }
        };

        const expectedResponse = {
            request_id: '12345',
            status: 'Success',
            message: 'Operation completed successfully',
            data: { key: 'value' }
        };

        const response = toTemplateResponseApi(params);
        expect(response).toEqual(expectedResponse);
    });

    it('should handle null data correctly', () => {
        const params = {
            request_id: '12345',
            status: 'Error',
            message: 'An error occurred',
            data: null
        };

        const expectedResponse = {
            request_id: '12345',
            status: 'Error',
            message: 'An error occurred',
            data: null
        };

        const response = toTemplateResponseApi(params);
        expect(response).toEqual(expectedResponse);
    });

    it('should handle undefined data correctly', () => {
        const params = {
            request_id: '12345',
            status: 'Error',
            message: 'An error occurred',
            data: undefined
        };

        const expectedResponse = {
            request_id: '12345',
            status: 'Error',
            message: 'An error occurred',
            data: undefined
        };

        const response = toTemplateResponseApi(params);
        expect(response).toEqual(expectedResponse);
    });
});