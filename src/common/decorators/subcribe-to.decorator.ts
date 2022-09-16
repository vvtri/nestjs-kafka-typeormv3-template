export interface SubscribeInfo {
  topic: string;
  context: any;
  handler: () => any;
}

export const subscribeInfos = new Map<string, SubscribeInfo>();

export const SubscribeTo = (
  topic: string,
  context: { new (...args: any[]): any },
  schemaId: number | null = null,
) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('SubscribeTo run');
    subscribeInfos.set(topic, {
      topic,
      handler: descriptor.value,
      context: context,
    });
  };
};
