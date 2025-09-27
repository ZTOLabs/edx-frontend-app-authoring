import { baseConfigs } from './base';

const configs = {
  eduoneAgentFeUrl: 'https://eduone-agent.ztolabs.dev',
  socketUrl: 'https://eduone-socket.ztolabs.dev',
};

export default Object.freeze({ ...baseConfigs, ...configs });
