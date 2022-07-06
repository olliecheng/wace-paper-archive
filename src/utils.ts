function titlecaseEnglish(word: string): string {
  const prepositions = ["and", "as", "an", "the"];

  if (prepositions.includes(word)) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export default {
  internalToDisplayName: (name: string): string => {
    const replacements = {
      Languagedialect: "Language/Dialect",
      "Children Family": "Children, Family",
      "( (?!Additional)\\w+ Language)": ":$1",
      Wace: "WACE",
      Wace1516: "WACE",
      Sampleexams: "Sample Exams",
    };

    // let displayName = name.replaceAll("_", " ");
    let words = name.split("_").map(titlecaseEnglish).join(" ");

    for (let [key, value] of Object.entries(replacements)) {
      words = words.replaceAll(new RegExp(key, "gi"), value);
    }

    return words;
  },

  objectMap: (
    obj: object,
    fn: (key: any, value: any) => undefined | [any, any]
  ): object => {
    return Object.fromEntries(
      Object.entries(obj).reduce((r: [any, any][], params) => {
        let result = fn(...params);
        if (result === undefined) {
          return r;
        }
        return [...r, result];
      }, [])
    );
  },
};
