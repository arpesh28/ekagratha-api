import { getS3ObjectUrl } from "../common/s3";
import { Team, TeamType } from "../models/Team.model";

var slugify = require("slugify");

export const generateSlug = async (name: string): Promise<string> => {
  let slug = slugify(name, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });

  //   Check if the slug already exist
  let existSlug = await Team.findOne({ slug });
  let count = 1;

  //    if exists then add an incremental count to the end until it's unique
  while (existSlug) {
    const newName = name + "-" + count;
    slug = slugify(newName, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      locale: "vi",
      trim: true,
    });
    existSlug = await Team.findOne({ slug });
    count++;
  }

  return slug;
};

export const generateIdentifier = (name: string) => {
  // Convert team name to uppercase
  const uppercaseName = name.toUpperCase();

  // Split team name into words
  const words = uppercaseName.split(" ");

  //   Return identifier string based on the length of the name
  if (words.length >= 3) {
    return words
      .slice(0, 3)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  } else if (words.length === 2) {
    if (words[0].length > 1) {
      return `${words[0].charAt(0).toUpperCase()}${words[0]
        .charAt(1)
        .toUpperCase()}${words[1].charAt(0).toUpperCase()}`;
    } else
      return `${words[0].charAt(0).toUpperCase()}${words[1]
        .charAt(0)
        .toUpperCase()}${words[1].charAt(1).toUpperCase()}`;
  } else if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }
};

export const populateTeamsIconURL = async (teams: TeamType[]) => {
  // Loop through all the teams and fill presigned url for the images
  for (const team of teams) {
    if (!team.icon) continue; // If there's no icon then don't change

    const preSignedUrl = await getS3ObjectUrl(team.icon); // Fetch pre signed url from s3

    if (preSignedUrl) team.icon = preSignedUrl; // Add presigned url to icon
  }

  return teams;
};
