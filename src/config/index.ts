import config from 'config';

export const Config = {
    PORT: config.get('server.port'),
};
