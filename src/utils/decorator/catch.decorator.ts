export function TryCatch(errorMsg?: string) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const origin = desc.value;

    desc.value = async function interceptTryCatchFn(...args: any[]) {
      try {
        return await origin.apply(this, args);
      } catch (e) {
        console.log("tryCatchDecorator", e);
        return { ok: false, error: errorMsg };
      }
    };
  };
}
