# Poshkaar Kashmir Android App

This folder tracks the Play Store packaging path for the Poshkaar Kashmir website.

Recommended route: package the live site as a Trusted Web Activity.

Live app URL:

```text
https://poshkaarkashmir.com
```

App name:

```text
Poshkaar Kashmir
```

Package name:

```text
com.poshkaarkashmir.app
```

Play Store assets now available from the website build:

```text
/images/poshkaar-icon-192.png
/images/poshkaar-icon-512.png
/images/poshkaar-maskable-512.png
/images/poshkaar-mark.svg
```

Before Play Store release, complete these owner-only steps:

1. Create or open the Google Play Console developer account.
2. Create the `Poshkaar Kashmir` app listing.
3. Generate/sign the Android App Bundle.
4. Upload the `.aab`, complete store listing, content rating, privacy policy, data safety, and production release review.

The website is now PWA-ready, so it can also be installed from Chrome on Android while the Play Store listing is being prepared.

## Current Status

Completed:

- Website has a valid web app manifest.
- Website has Poshkaar app icons at 192px and 512px.
- Website has a maskable Android icon.
- Website has a service worker.
- Website is ready to be wrapped as a Trusted Web Activity.

Blocked on this machine:

- Java/JDK is not installed.
- Android SDK is not installed.
- Gradle is not installed.
- Android Studio is not installed.
- Bubblewrap asks to install the JDK interactively, which cannot complete in the current non-interactive shell.

Blocked on account:

- Gmail access is not enough to publish.
- A Google Play Console developer account is required.
- App creation, declarations, Play App Signing, policy forms, and production submission must happen from the owner Play Console account.

## Build Plan

Once Java/Android Studio are available, create the Android package with Bubblewrap:

```powershell
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://poshkaarkashmir.com/site.webmanifest
bubblewrap build
```

Target values:

```text
Application name: Poshkaar Kashmir
Launcher name: Poshkaar
Package ID: com.poshkaarkashmir.app
Start URL: https://poshkaarkashmir.com/
Host: poshkaarkashmir.com
Theme color: #1D1D1D
Background color: #F7F1E8
Display mode: standalone
Orientation: portrait
```

Expected upload artifact:

```text
app-release-bundle.aab
```

## Play Console Setup

In Google Play Console:

1. Create app.
2. App name: `Poshkaar Kashmir`.
3. Default language: English.
4. Type: App.
5. Price: Free.
6. Contact email: use the official Poshkaar Kashmir support email.
7. Accept Developer Program Policies.
8. Accept US export laws declaration.
9. Accept Play App Signing terms.
10. Upload the Android App Bundle.
11. Complete store listing, privacy policy, data safety, content rating, target audience, and production release.

## Store Listing Draft

Short description:

```text
Shop Kashmiri Pashmina, Tilla, Aari, walnut wood, papier mache, copperware and willow wicker by Poshkaar Kashmir.
```

Full description:

```text
Poshkaar Kashmir presents a curated collection of Kashmiri craft, clothing, textiles, gifts and home objects. Explore Kashmiri Pashmina shawls, Tilla work, Aari embroidery, Dabka and Zari occasion wear, walnut wood carving, papier mache, copperware and willow wicker pieces with clear product photographs, material notes, origin details, care information and WhatsApp ordering support.

The Poshkaar Kashmir app helps customers browse new arrivals, craft collections, bridal pieces, pashmina, handcrafted gifts and ready product edits from one calm mobile shopping experience.
```

Keywords to include naturally in listing assets:

```text
Kashmiri Pashmina, Kashmir Pashmina shawl, Kashmiri Tilla, Kashmiri Aari, Kashmiri embroidery, Kashmiri walnut wood, Kashmiri papier mache, Kashmir paper mache, Kashmiri copperware, Kashmiri willow wicker, Kashmiri handicrafts, Kashmiri gifts, Kashmir clothing, Poshkaar Kashmir
```
