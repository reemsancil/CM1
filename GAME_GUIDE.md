# CM1 English Games

Open `index.html` in a browser. The site also works on any static web server.
No account, build step, or network connection is required for the games.

The homepage separates Vocabulary and Grammar. Each topic has its own screen,
and each game has its own URL hash. Home is available in the header on every
screen. Back links return to the current topic.

## Included games

- London Landmarks: Guess the Landmark, Who or What Am I?, Match the Landmark.
- Family Tree: Family Tree Quiz, Choose the Relationship.
- Subject Pronouns: Replace the Subject, Pronoun Challenge.
- Object Pronouns: Replace the Object, Subject or Object Pronoun?
- Verb to Be: Am / Is / Are, Make It Negative, Make a Question.
- Prepositions of Place: Where is it?, London Map Challenge.

There are 149 questions and matches in total. All 12 requested London names
appear in each landmark activity. Matching presents four pairs at a time.
The London map is fictional. Its front/back direction is marked.

## Scoring

Correct answers receive immediate feedback and unlock the Next Question button.
Incorrect answers receive “Try again!” and can be retried. A point is awarded
only for a correct first attempt. Each result screen includes Play Again and
Home. Best scores are saved in the current browser when storage is available;
games still work if browser storage is blocked.

## Development and checks

The original `README.md` is unchanged. Edit `index.html`, `styles.css`, `data.js`,
and `app.js`. `npm run build` copies these files to `dist/` for static hosting.
For interaction tests, install the development dependency with `npm install`,
then run `npm test` from this directory.

Validation covers all games from start to result, topic navigation, retries,
first-try scoring, matching, replay, and invalid route fallback. Browser visual
QA was unavailable in the execution environment.

## Publish with Netlify

1. In Netlify, import the existing GitHub repository `reemsancil/CM1`.
2. Select the `main` branch.
3. Use build command `node build.cjs` and publish directory `dist`.
   These settings are also provided in `netlify.toml`.
4. Deploy, then share the Netlify site URL with students.

The website has no runtime dependencies, server, or login requirement.
Use the Netlify URL as the final student link. No GitHub Pages setup is needed.
ChatGPT Sites configuration is excluded from this GitHub export.
