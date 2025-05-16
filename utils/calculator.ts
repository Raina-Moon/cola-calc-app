type ColaType = "ORIGINAL" | "ZERO";

export function caculateMaxCola(weight: number, type: ColaType): number {
  if (type === "ORIGINAL") {
    const sugarLimitPerKg = 0.5;
    const colaSugarPer100ml = 10.6;
    const maxSugar = weight * sugarLimitPerKg;
    return (maxSugar / colaSugarPer100ml) * 100;
  }

  if (type === "ZERO") {
    const caffeineLimitPerKg = 3;
    const colaCaffeinePer100ml = 9.7;
    const maxCaffeine = weight * caffeineLimitPerKg;
    return (maxCaffeine / colaCaffeinePer100ml) * 100;
  }

  return 0;
}
