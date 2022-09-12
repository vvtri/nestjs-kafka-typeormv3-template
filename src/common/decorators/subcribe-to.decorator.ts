export interface SubscribeInfo {
  topic: string;
  context: any;
  handler: () => any;
}

export const subscribeInfo = new Map<string, SubscribeInfo>();

export const SubscribeTo = (
  topic: string,
  context: { new (...args: any[]): any },
) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('SubscribeTo run');
    subscribeInfo.set(topic, {
      topic,
      handler: descriptor.value,
      context: context,
    });
  };
};
