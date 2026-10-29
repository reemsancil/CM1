# Directions games

The directions lesson is locked by default. Its home card and direct game URLs show “Available after the lesson.” The build excludes the questions from the deployed files while locked.

Prepared activities use vocabulary from Directions.pdf, Directions 2.pdf and Directions Listening.pdf:
- Direction Detectives: 12 sign and vocabulary questions.
- Complete the Directions: 10 missing-word questions (reading practice; no audio was supplied).
- Town Trail: 8 route questions using an original practice map, separate from the worksheet maps.

## Release after teaching

Change `released` to `true` in `directions-settings.json`, run `npm run build`, and commit and push to the existing main branch. Netlify rebuilds the same site. This releases the games to everyone; there is no student unlock code.

To lock them again, set `released` to `false`, rebuild and push. Students must refresh an already-open page. Already downloaded content cannot be recalled.

Existing Unit 1 certificates keep their original requirements. These new games are not added to the Unit 1 gift catalog.
