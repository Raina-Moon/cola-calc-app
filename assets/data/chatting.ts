export const chatting = {
  start: {
    message: "Hey there! I'm your Cola Fairy 💫 {{lateMessage}}",
    options: [
      { text: "Give me a health summary", next: "summary" },
      { text: "Am I drinking too much?", next: "feedback" },
      { text: "Any advice for me?", next: "tip" },
    ],
  },
  summary: {
    message:
      "Today, you drank {{sum}}ml of {{colaType}} Cola.\nYour recommended max is {{max}}ml.{{overLimitMessage}}",
    options: [
      {
        text: "That's a lot?",
        next: "overconsumption",
        condition: "sum > max",
      },
      { text: "Is that okay?", next: "undercontrol", condition: "sum <= max" },
      { text: "Back", next: "start" },
    ],
  },
  overconsumption: {
    message:
      "⚠️ You're over the {{colaType}} Cola limit! Consider cutting back — excess {{colaType === 'Original' ? 'sugar' : 'sweetener'}} can harm your health.",
    options: [
      { text: "What should I do?", next: "remedy" },
      { text: "Back", next: "start" },
    ],
  },
  undercontrol: {
    message:
      "You're doing great! Staying within your daily limit is a healthy habit. Keep going 💪",
    options: [{ text: "Back", next: "start" }],
  },
  remedy: {
    message:
      "{{colaType === 'Original' ? 'Drink more water and reduce sugar gradually.' : 'Hydrate and avoid artificial sweeteners for a day or two.'}}",
    options: [{ text: "Back", next: "start" }],
  },
  feedback: {
    message:
      "{{sum > max ? 'Yes, you exceeded your limit today.' : 'You’re in the safe zone! Keep it up 💧'}} {{lateMessage}}",
    options: [{ text: "Back", next: "start" }],
  },
  tip: {
    message:
      "{{sum > max ? 'Hydrate well and skip caffeine tomorrow ☕' : 'Stretch, relax, and drink some water 💧'}}",
    options: [{ text: "Back", next: "start" }],
  },
};
