# Unit 1 gifts and certificates

This feature supports CP, CE2 and CM1. The shared database setup must be completed before gifts can be sent on the live websites.

## Test without publishing

Download the test-unit1-gifts branch ZIP from GitHub and open CM1-TEST-GIFTS.html in gift-tests. Complete every exercise using the same name and section and submit each result. Click Test teacher results, then Open test results; no teacher password is needed in the test copy. Click Send gift next to your name. Click Back to games, then Check my gifts, and enter the same name and class. Confetti and Gift from Mrs. Reem appear. Open the gift to collect the certificate. My certificates keeps opened certificates.

The test copy stores practice data in this browser and never contacts Supabase. Use the same downloaded file and browser throughout the test. Keep the browser's storage; private browsing may erase it. Your live teacher results are not included.

## Enable shared live gifts later

Run school-certificates.sql once in the existing Supabase project's SQL editor. The identical SQL in each repository configures all three levels together: CP 5 exercises, CE2 11 exercises, CM1 16 exercises. It does not change existing student_results data or policies. Teacher-only read and award permissions are enforced by RLS and an authenticated RPC, which checks every required exercise again on the server. Anonymous callers cannot list or award certificates; name/class lookup returns only matching certificates. A second send reuses the same award.

All finished exercises count, including low first-try CM1 scores. Repeated attempts do not replace missing exercises. Removed CP word-matching exercises are not required. The Unit 1 catalog is fixed, so new themes must be added as new units later rather than added to Unit 1.

Students identify themselves by name and class, not a password. Use consistent spelling; case and repeated spaces are ignored. Two children with the same name in the same class cannot be distinguished by this approach. Each level has separate class options and certificates. Gifts move to My certificates after opening and remain accessible across devices after database setup.

Live database permissions and browser visuals still need verification. No live database changes were made through this workspace.
