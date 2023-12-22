import { fetchGithub } from "$utils/fetch.ts";
import { ByteCodePointConverter } from "./utils.ts";

const CONTENTS_URL = "https://raw.githubusercontent.com/vwkd/kita-verbs-data/main/src/vz.txt";

const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");

const input = await fetchGithub(CONTENTS_URL, GITHUB_TOKEN);

export const inputObj = ByteCodePointConverter(input);
