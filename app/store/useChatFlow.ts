import { useState } from "react";
import { chatting } from "@/assets/data/chatting";
import { fillTemplate } from "@/utils/fillTemplate";

type StepKey = keyof typeof chatting;

type ChatOption = {
  text: string;
  next: StepKey;
  condition?: string;
};

export const useChatFlow = (dynamicVars: Record<string, any>) => {
  const [step, setStep] = useState<StepKey>("start");
  const rawStep = chatting[step];
  const message = fillTemplate(rawStep.message, dynamicVars);
  const option = (rawStep.options as ChatOption[]).filter((item) => {
    if (!item.condition) return true;
    try {
      const func = new Function(
        ...Object.keys(dynamicVars),
        `return ${item.condition}`
      );
      return func(...Object.values(dynamicVars));
    } catch {
      return true;
    }
  });

  return { message, option, setStep };
};
