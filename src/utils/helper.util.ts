import { Team } from "../models/Team.model";

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
