// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { z } from "zod";

const limit = 20;

const validateDiscEnum = z.enum(["jp", "cc", "nk", "al", "fs", "sb", "ma", "gs", "tm", "ss"]);
const validateRequest = z.object({
  discipline: validateDiscEnum,
  season: z.optional(
    z.preprocess(
      (v) => +v,
      z
        .number()
        .min(1924)
        .max(new Date().getFullYear() + 1)
    )
  ),
  name: z.optional(z.string()),
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  const validation = validateRequest.safeParse(req.query);

  if (!validation.success) {
    return res.status(400).send({
      message: validation.error,
    });
  }

  const { discipline, season, name } = req.query;

  let path = `https://api.fis-ski.com/sanctions/${discipline}`;
  if (season) {
    path += `/${season}`;
  }

  try {
    const response = await fetch(path);
    const data = await response.json();
    if (response.status === 422) {
      res.status(422).json({ error: data.error?.disciplineCode || data.error });
      return;
    }

    let filteredItems = data;
    if (name) {
      const lowerName = name.toLowerCase();
      filteredItems = data.filter((item) => {
        const athlete = item?.athlete;
        if (athlete) {
          const { firstName, lastName } = athlete;
          const fullName = `${firstName} ${lastName}`.toLowerCase();
          return fullName.includes(lowerName);
        }
        return false;
      });
    }

    const sortedItems = filteredItems
      .sort((a, b) => {
        const dateA = new Date(a?.competitionSummary?.date);
        const dateB = new Date(b?.competitionSummary?.date);

        if (isNaN(dateA) || isNaN(dateB)) {
          return 0;
        }

        return dateA - dateB;
      })
      .slice(0, limit);

    res.status(200).json(sortedItems);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
