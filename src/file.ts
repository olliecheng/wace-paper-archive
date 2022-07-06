import * as clientZip from "client-zip";
import streamSaver from "streamsaver";

export const BASE_URL = "https://papers.olliecheng.me";
streamSaver.mitm = `${BASE_URL}/stream-dw.html`;

export interface fileObject {
  path: string;
  url: string;
  size: number;
}

async function download(event: MouseEventInit) {
  console.log("Hi");

  let files = [
    ...crawlDirTree(["biology"], dirs),
    ...crawlDirTree(["chemistry"], dirs),
    ...crawlDirTree(["physics"], dirs),
    ...crawlDirTree(["mathematics_methods"], dirs),
    ...crawlDirTree(["mathematics_specialist"], dirs),
    ...crawlDirTree(["french_second_language"], dirs),
    ...crawlDirTree(["ancient_history"], dirs),
    ...crawlDirTree(["mathematics_applications"], dirs),
  ];
  console.log("results", files, dirs);

  let metadata = files.map((x) => {
    return {
      name: x.path,
      size: x.size,
    };
  });

  // const zipSize = calculateZipSize(files);
  const zipSize = clientZip.predictLength(metadata);

  interface InputType {
    name: string;
    input: Response;
  }

  let fileResponses: InputType[] = [];

  async function* lazyFetch(): AsyncGenerator<InputType, void, void> {
    for (let file of files)
      yield {
        name: file.path,
        input: await fetch(file.url),
      };
  }

  const fileZipped = clientZip.downloadZip(lazyFetch());

  fileStream = streamSaver.createWriteStream("filename.zip", {
    size: zipSize, // (optional filesize) Will show progress
  });

  downloadComplete = false;
  fileZipped.body!.pipeTo(fileStream).then(
    () => {
      downloadComplete = true;
    },
    () => {
      downloadComplete = true;
      console.log("Failed");
    }
  );
}

function crawlDirTree(paths: string[], dirs): fileObject[] {
  let basePath = paths.join("/");

  return Object.entries(dirs)
    .filter(([path, _]) => {
      return path.startsWith(basePath);
    })
    .map(([path, size]) => {
      return {
        path: path,
        url: encodeURI(`${BASE_URL}/${path}`),
        size: size as number,
      };
    });
}

let dirs;
let downloadComplete = true;
let fileStream;

// abort so it does not look stuck
window.onunload = () => {
  if (fileStream) {
    fileStream.abort();
  }
};

window.onbeforeunload = (evt) => {
  if (!downloadComplete) {
    return "Are you sure you want to leave? Closing this site will stop the download.";
  }
};

export async function fetchDirectoryTree() {
  console.log("Downloading dirs...");

  let rootReq = await fetch(`${BASE_URL}/root.json`);
  let rootText = await rootReq.text();

  console.log("Downloaded.");
  let rootObj = JSON.parse(rootText);

  delete rootObj["root.json"];

  console.debug(rootObj);

  dirs = rootObj;
  return rootObj;
}

export function placeholderDirectoryTree() {
  return [
    "accounting_and_finance",
    "ancient_history",
    "animal_production_systems",
    "applied_information_technology",
    "aviation",
    "biology",
    "business_management_and_enterprise",
    "career_and_enterprise",
    "chemistry",
    "children_family_and_the_community",
    "chinese_first_language",
    "chinese_second_language",
    "computer_science",
    "dance",
    "design",
    "drama",
    "earth_and_environmental_science",
    "economics",
    "engineering_studies",
    "english",
    "english_as_an_additional_languagedialect",
    "food_science_and_technology",
    "french",
    "french_second_language",
    "geography",
    "german",
    "german_background_language",
    "health_studies",
    "human_biology",
    "indonesian_second_language",
    "integrated_science",
    "italian",
    "italian_second_language",
    "japanese_second_language",
    "literature",
    "marine_and_maritime_studies_formerly_technology",
    "materials_design_and_technology",
    "mathematics_applications",
    "mathematics_methods",
    "mathematics_specialist",
    "media_production_and_analysis",
    "modern_history",
    "music",
    "outdoor_education",
    "philosophy_and_ethics",
    "physical_education_studies",
    "physics",
    "plant_production_systems",
    "politics_and_law",
    "psychology",
    "religion_and_life",
    "visual_arts",
  ];
}
