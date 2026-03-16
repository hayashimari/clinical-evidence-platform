type ClassValue = string | number | false | null | undefined | ClassValue[];

function flatten(inputs: ClassValue[]): string[] {
  return inputs.flatMap((input) => {
    if (Array.isArray(input)) {
      return flatten(input);
    }

    if (typeof input === "string" || typeof input === "number") {
      return [String(input)];
    }

    return [];
  });
}

export function cn(...inputs: ClassValue[]) {
  return flatten(inputs).join(" ");
}
